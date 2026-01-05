import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, GLOBAL_STYLES } from '../theme';
import { useNavigation } from '@react-navigation/native';

export default function RideScreen() {
  const navigation = useNavigation();

  // Coordenadas simuladas (Manaus)
  const origin = { latitude: -3.119027, longitude: -60.021731 };
  const dest = { latitude: -3.100000, longitude: -60.010000 };

  return (
    <View style={GLOBAL_STYLES.container}>
      
      {/* MAPA LIGHT MODE (Padrão Google) */}
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -3.1100,
          longitude: -60.0150,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
      >
        <Marker coordinate={origin} title="Origem" pinColor="green" />
        <Marker coordinate={dest} title="Destino" pinColor="red" />
        <Polyline 
            coordinates={[origin, {latitude: -3.11, longitude: -60.015}, dest]} 
            strokeColor="#0b1437" 
            strokeWidth={4} 
        />
      </MapView>

      {/* HEADER NAVEGAÇÃO */}
      <View style={styles.navHeader}>
        <View style={styles.navInstruction}>
            <Text style={styles.navDistance}>200m</Text>
            <Text style={styles.navAction}>Vire à direita na Av. Djalma Batista</Text>
        </View>
      </View>

      {/* PAINEL INFERIOR */}
      <View style={styles.bottomPanel}>
        <View style={styles.dragHandle} />
        
        <View style={styles.tripInfo}>
            <View style={styles.passengerAvatar}><Text>👤</Text></View>
            <View style={{flex: 1}}>
                <Text style={styles.passengerName}>Roberto A.</Text>
                <Text style={styles.tripStatus}>Em rota para destino</Text>
            </View>
            <View style={styles.etaBox}>
                <Text style={styles.etaTime}>18:30</Text>
                <Text style={styles.etaLabel}>ETA</Text>
            </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.addressRow}>
            <View style={styles.dotOrigin} />
            <Text style={styles.addressText}>Aeroporto Eduardo Gomes</Text>
        </View>
        <View style={styles.verticalLine} />
        <View style={styles.addressRow}>
            <View style={styles.dotDest} />
            <Text style={styles.addressText}>Hotel Tropical Executive</Text>
        </View>

        <TouchableOpacity style={styles.finishButton} onPress={() => navigation.goBack()}>
            <Text style={styles.finishText}>FINALIZAR CORRIDA</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.success,
    ...GLOBAL_STYLES.shadow,
  },
  navInstruction: { flexDirection: 'column' },
  navDistance: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  navAction: { color: COLORS.textSecondary, fontSize: 16, marginTop: 4 },
  
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    ...GLOBAL_STYLES.shadow,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  tripInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  passengerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  passengerName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  tripStatus: { color: COLORS.primary, fontSize: 14 },
  etaBox: { alignItems: 'center', backgroundColor: '#232730', padding: 8, borderRadius: 8 },
  etaTime: { color: 'white', fontWeight: 'bold' },
  etaLabel: { color: 'gray', fontSize: 10 },
  
  divider: { height: 1, backgroundColor: '#333', marginBottom: 20 },
  
  addressRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  dotOrigin: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.textSecondary, marginRight: 10 },
  dotDest: { width: 10, height: 10, borderRadius: 2, backgroundColor: COLORS.primary, marginRight: 10 },
  addressText: { color: COLORS.textSecondary, fontSize: 14 },
  verticalLine: { width: 1, height: 20, backgroundColor: '#333', marginLeft: 4.5 },

  finishButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  finishText: { color: 'black', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 },
});