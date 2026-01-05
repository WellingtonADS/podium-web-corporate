import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text, TouchableOpacity, StatusBar, Switch } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Estilo JSON "Midnight Commander" (Referência: Snazzy Maps)
const MIDNIGHT_COMMANDER_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
  { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
  { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];

export default function MapScreen() {
  const { signOut } = useAuth();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true); // Estado Online/Offline

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    const startLocationTracking = async () => {
      try {
        // 1. Permissões
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão Negada', 'O acesso à localização é obrigatório para operar.');
          setLoading(false);
          return;
        }

        // 2. Posição Inicial Rápida
        const currentLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation(currentLoc);
        setLoading(false);

        // 3. Atualização em Tempo Real (Telemetria)
        // Atualiza a cada 5 segundos ou 10 metros
        subscription = await Location.watchPositionAsync(
          { 
            accuracy: Location.Accuracy.High, 
            timeInterval: 5000, 
            distanceInterval: 10 
          },
          async (newLoc) => {
            setLocation(newLoc);
            
            if (isOnline) {
                // --- ENVIO PARA O BACKEND ---
                try {
                    console.log('[GPS] Enviando localização:', {
                        lat: newLoc.coords.latitude,
                        lng: newLoc.coords.longitude
                    });
                    
                    await api.patch('/users/me/location', {
                        lat: newLoc.coords.latitude,
                        lng: newLoc.coords.longitude
                    });
                    
                    console.log('[GPS] Localização enviada com sucesso');
                } catch (error: any) {
                    console.warn('[GPS] Falha ao enviar localização');
                    // Se o erro for 401 (Unauthorized), força o logout
                    if (error.response && error.response.status === 401) {
                        Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.');
                        signOut();
                    }
                }
            }
          }
        );

      } catch {
        Alert.alert('Erro GPS', 'Não foi possível obter a localização.');
        setLoading(false);
      }
    };

    startLocationTracking();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isOnline]); // Dependência: reinicia tracking se mudar status online

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Conectando GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MIDNIGHT_COMMANDER_STYLE}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
        showsMyLocationButton={false} 
      />

      {/* PAINEL INFERIOR (HUD) */}
      <View style={styles.bottomPanel}>
        
        {/* Status Header */}
        <View style={styles.statusHeader}>
            <View style={styles.statusInfo}>
                <Text style={styles.driverName}>Olá, Motorista</Text>
                <Text style={styles.statusLabel}>
                    {isOnline ? '🟢 Você está Online' : '🔴 Você está Offline'}
                </Text>
            </View>
            <Switch 
                trackColor={{ false: "#3e3e3e", true: "#D4AF37" }}
                thumbColor={isOnline ? "#fff" : "#f4f3f4"}
                onValueChange={setIsOnline}
                value={isOnline}
            />
        </View>

        {/* Estatísticas Rápidas */}
        <View style={styles.statsGrid}>
            <View style={styles.statItem}>
                <Text style={styles.statValue}>R$ 0,00</Text>
                <Text style={styles.statLabel}>Ganhos Hoje</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Corridas</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
                <Text style={styles.statValue}>5.0</Text>
                <Text style={styles.statLabel}>Nota</Text>
            </View>
        </View>

        {/* Botão Logout Discreto */}
        <TouchableOpacity onPress={signOut} style={styles.logoutLink}>
            <Text style={styles.logoutText}>Encerrar Turno (Sair)</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1437' },
  map: { width: '100%', height: '100%' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b1437' },
  loadingText: { color: '#D4AF37', marginTop: 10 },
  
  // Painel Inferior Estilizado
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111c44',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusInfo: {
    flexDirection: 'column',
  },
  driverName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusLabel: {
    color: '#8f9bba',
    fontSize: 14,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#0b1437',
    padding: 16,
    borderRadius: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#8f9bba',
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: '#1f2747',
  },
  logoutLink: {
    alignItems: 'center',
    padding: 10,
  },
  logoutText: {
    color: '#ef4444', // Vermelho suave
    fontSize: 14,
    fontWeight: 'bold',
  }
});