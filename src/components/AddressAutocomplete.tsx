import {
  Box,
  FormControl,
  FormLabel,
  Input,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useRef, useState } from "react";

interface NominatimResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  importance?: number;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
}

interface AddressData {
  address: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface AddressAutocompleteProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (addressData: AddressData) => void;
  onTextChange?: (text: string) => void;
}

// Extrai número da rua do texto de entrada
const extractStreetNumber = (
  text: string
): { street: string; number?: string } => {
  // Padrão: busca por números no final ou depois de vírgula
  const match = text.match(/(.+?),?\s+(\d+)\s*$/);
  if (match) {
    return {
      street: match[1].trim(),
      number: match[2].trim(),
    };
  }
  return { street: text };
};

// Formata endereço de forma concisa e clara
// Para POIs (pontos de interesse), prioriza o nome do lugar
// Para endereços residenciais, usa o formato tradicional
const formatAddress = (result: NominatimResult): string => {
  // Detecta se é um POI (ponto de interesse) pelo tipo
  const isPOI =
    result.type &&
    [
      "amenity",
      "healthcare",
      "hospital",
      "clinic",
      "pharmacy",
      "tourism",
      "attraction",
      "museum",
      "theater",
      "theatre",
      "cinema",
      "restaurant",
      "landmark",
      "bank",
      "school",
    ].includes(result.type.toLowerCase());

  // Para POIs, extrai e prioriza o nome do lugar
  if (isPOI && result.display_name) {
    // Se o display_name começa com o nome do lugar, usa ele
    const parts = result.display_name.split(",").map((p) => p.trim());

    if (result.address && result.address.road) {
      // Formato: "Nome do POI, Rua, Bairro, Cidade"
      return [
        parts[0], // Nome do POI
        result.address.road,
        result.address.suburb,
        result.address.city,
      ]
        .filter(Boolean)
        .join(", ");
    }

    // Se não tiver rua, tenta usar até 3 partes do display_name
    return parts.slice(0, 3).join(", ");
  }

  // Para endereços residenciais/comerciais normais
  if (result.address) {
    const { house_number, road, suburb, city } = result.address;
    const parts = [];

    if (road) parts.push(road);
    if (house_number) parts.push(house_number);
    if (suburb) parts.push(suburb);
    if (city) parts.push(city);

    return parts.join(", ");
  }

  return result.display_name;
};

// Filtra resultados por tipo (endereços + pontos de interesse importantes)
const isRelevantResult = (result: NominatimResult): boolean => {
  const relevantTypes = [
    // Endereços
    "house",
    "building",
    "residential",
    "commercial",
    "street",
    "road",
    // Pontos de interesse (POIs)
    "amenity",
    "healthcare",
    "hospital",
    "clinic",
    "pharmacy",
    "doctor",
    "dentist",
    "tourism",
    "attraction",
    "museum",
    "theater",
    "theatre",
    "cinema",
    "restaurant",
    "cafe",
    "shop",
    "supermarket",
    "mall",
    "office",
    "bank",
    "school",
    "university",
    "church",
    "mosque",
    "temple",
    "landmark",
    "park",
    "sports",
    "gym",
  ];
  const type = result.type || "";

  // Se tiver tipo específico, verifica se é relevante
  if (type) {
    return relevantTypes.includes(type.toLowerCase());
  }

  // Se não tiver tipo, verifica importância (quanto mais alto, mais relevante)
  // Reduzido threshold de importância para aceitar mais POIs
  return result.importance !== undefined && result.importance > 0.2;
};

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label,
  placeholder = "Digite um endereço...",
  value,
  onChange,
  onTextChange,
}) => {
  const [input, setInput] = useState(value);
  const [predictions, setPredictions] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Busca endereços usando múltiplas estratégias - TOTALMENTE GRATUITO
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const text = e.target.value;
      setInput(text);
      onTextChange?.(text);

      // Limpa o timer anterior
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (!text || text.length < 3) {
        setPredictions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);

      // Aguarda 300ms antes de fazer a requisição (debounce reduzido)
      debounceTimer.current = setTimeout(async () => {
        try {
          // Extrai número da rua se estiver no input
          const { street, number } = extractStreetNumber(text);

          // ESTRATÉGIA 1: Tenta com Photon primeiro (mais rápido que Nominatim)
          // Photon usa mesmos dados do OpenStreetMap mas é mais otimizado
          let results: NominatimResult[] = [];

          try {
            const photonResponse = await fetch(
              `https://photon.komoot.io/api?q=${encodeURIComponent(
                street
              )}&lat=-3.12&lon=-60.02&zoom=10&limit=15&lang=pt`,
              {
                signal: AbortSignal.timeout
                  ? AbortSignal.timeout(3000)
                  : undefined,
              } as RequestInit
            );

            if (photonResponse.ok) {
              interface PhotonFeature {
                properties: Record<string, string | number | undefined>;
                geometry: { coordinates: [number, number] };
              }
              interface PhotonResponse {
                features: PhotonFeature[];
              }
              const photonData =
                (await photonResponse.json()) as PhotonResponse;
              if (photonData.features && photonData.features.length > 0) {
                results = photonData.features.map((feature: PhotonFeature) => ({
                  place_id: String(feature.properties.osm_id || ""),
                  display_name: String(feature.properties.name || ""),
                  lat: feature.geometry.coordinates[1].toString(),
                  lon: feature.geometry.coordinates[0].toString(),
                  type: String(feature.properties.osm_type || ""),
                  address: {
                    // Usa o número extraído se disponível, senão tenta do resultado
                    house_number:
                      number ||
                      (feature.properties.housenumber
                        ? String(feature.properties.housenumber)
                        : undefined),
                    road: feature.properties.street
                      ? String(feature.properties.street)
                      : undefined,
                    suburb: feature.properties.district
                      ? String(feature.properties.district)
                      : undefined,
                    city: feature.properties.city
                      ? String(feature.properties.city)
                      : undefined,
                    postcode: feature.properties.postcode
                      ? String(feature.properties.postcode)
                      : undefined,
                  },
                }));
              }
            }
          } catch (photonError) {
            console.warn(
              "Photon não disponível, usando Nominatim...",
              photonError
            );
          }

          // ESTRATÉGIA 2: Se Photon não retornar resultados, usa Nominatim
          if (results.length === 0) {
            const nominatimResponse = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                street
              )}&countrycodes=br&limit=20&addressdetails=1&extratags=1&polygon_geojson=0&viewbox=-73.769,-5.016,-59.974,-1.027&bounded=0`,
              {
                headers: {
                  "Accept-Language": "pt-BR",
                  "User-Agent": "PodiumServices/1.0",
                },
              }
            );

            if (!nominatimResponse.ok)
              throw new Error("Erro na busca de endereços");

            results = (await nominatimResponse.json()) as NominatimResult[];

            // Adiciona número extraído aos resultados do Nominatim também
            results = results.map((result) => ({
              ...result,
              address: {
                ...result.address,
                house_number: number || result.address?.house_number,
              },
            }));
          }

          if (results && results.length > 0) {
            // Filtra por tipos relevantes e remove duplicatas
            const filtered = results
              .filter(
                (result) =>
                  result.display_name &&
                  (isRelevantResult(result) || result.address?.road)
              )
              .reduce((unique: NominatimResult[], item) => {
                if (!unique.find((u) => u.display_name === item.display_name)) {
                  unique.push(item);
                }
                return unique;
              }, [])
              .slice(0, 8);

            setPredictions(filtered);
            setShowDropdown(true);
          } else {
            setPredictions([]);
          }
        } catch (error) {
          console.error("Erro ao buscar endereços:", error);
          setPredictions([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [onTextChange]
  );

  // Trata a seleção de um endereço
  const handleSelectPlace = useCallback(
    (result: NominatimResult) => {
      // Usa endereço formatado se disponível, senão usa display_name completo
      const formattedAddr = formatAddress(result);

      const addressData: AddressData = {
        address: formattedAddr,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        placeId: result.place_id.toString(),
      };

      setInput(formattedAddr);
      onChange(addressData);

      // Fecha o dropdown
      setPredictions([]);
      setShowDropdown(false);
    },
    [onChange]
  );

  return (
    <FormControl mb={4}>
      <FormLabel fontSize="sm" fontWeight="600" color="white">
        {label}
      </FormLabel>

      <Input
        placeholder={placeholder}
        value={input}
        onChange={handleInputChange}
        onFocus={() => predictions.length > 0 && setShowDropdown(true)}
        bg="midnight.700"
        color="white"
        borderColor="gold.600"
        _placeholder={{ color: "midnight.400" }}
        _focus={{ borderColor: "gold.500", boxShadow: "0 0 0 1px #d4af37" }}
        autoComplete="off"
      />

      {/* Loading spinner */}
      {loading && (
        <Box position="absolute" right={3} top={10}>
          <Spinner size="sm" color="gold.500" />
        </Box>
      )}

      {/* Dropdown de sugestões */}
      {showDropdown && predictions.length > 0 && (
        <List
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="midnight.800"
          border="1px solid"
          borderColor="gold.600"
          borderTop="none"
          borderRadius="0 0 md md"
          maxH="300px"
          overflowY="auto"
          zIndex={10}
          mt={0}
          boxShadow="lg"
        >
          {predictions.map((result) => (
            <ListItem
              key={result.place_id}
              p={3}
              cursor="pointer"
              _hover={{ bg: "midnight.700", borderLeft: "3px solid #d4af37" }}
              borderLeft="3px solid transparent"
              onClick={() => handleSelectPlace(result)}
              color="white"
              fontSize="sm"
              borderBottom="1px solid"
              borderBottomColor="midnight.600"
              _last={{ borderBottom: "none" }}
            >
              <Text fontWeight="500">{formatAddress(result)}</Text>
              <Text fontSize="xs" color="midnight.300" mt={1}>
                {result.display_name.split(",").slice(-2).join(",")}
              </Text>
            </ListItem>
          ))}
        </List>
      )}
    </FormControl>
  );
};
