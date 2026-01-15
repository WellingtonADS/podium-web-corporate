// DEPRECATED: Componente de Mapa em Tempo Real.
// Não é usado no Portal Corporativo (B2B). Remover ou mover para pacote de Operação.
import { Badge, Box, Text } from "@chakra-ui/react";
import L from "leaflet";
import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { User } from "../services/api";

// Ícone customizado usando podium-luxury.png
const iconPerson = new L.Icon({
  iconUrl: "/podium-luxury.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

interface LiveMapProps {
  drivers: User[];
}

export const LiveMap: React.FC<LiveMapProps> = ({ drivers }) => {
  // Filtra apenas motoristas com localização válida
  const activeDrivers = drivers.filter(
    (d) => d.driver_profile?.current_lat && d.driver_profile?.current_lng
  );

  // Centro inicial (Manaus - Teatro Amazonas como referência)
  const defaultCenter: [number, number] = [-3.1303, -60.0234];

  return (
    <Box h="100%" w="100%" borderRadius="20px" overflow="hidden" zIndex={0}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Tile Layer Claro (CartoDB Positron) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {activeDrivers.map((driver) => (
          <Marker
            key={driver.id}
            position={[
              driver.driver_profile!.current_lat!,
              driver.driver_profile!.current_lng!,
            ]}
            icon={iconPerson}
          >
            <Popup>
              <Box color="black">
                <Text fontWeight="bold">{driver.full_name}</Text>
                <Text fontSize="sm">
                  {driver.driver_profile?.vehicle_model} -{" "}
                  {driver.driver_profile?.vehicle_plate}
                </Text>
                <Badge colorScheme="green">Online</Badge>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};
