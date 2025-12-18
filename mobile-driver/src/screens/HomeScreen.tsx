import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, StatusBar, Switch } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS, MAP_STYLE_DARK, GLOBAL_STYLES } from '../theme';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [location, setLocation] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [hasRequest, setHasRequest] = useState(false); // Simulação de estado

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
      
      // Simula uma chamada chegando após 3 segundos
      setTimeout(() => setHasRequest(true), 3000);
    })();
  }, []);

  const handleAccept = () => {
    setHasRequest(false);
    navigation.navigate('InRide'); // Vai para a tela de navegação
  };

  return (
    <View style={GLOBAL_STYLES.container}>
      <StatusBar barStyle="light-content" />
      
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        customMapStyle={MAP_STYLE_DARK}
        showsUserLocation={true}
        initialRegion={{
          latitude: -3.119027,
          longitude: -60.021731,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />

      {/* CAMADA 1: HEADER FLUTUANTE */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={{color:'white', fontSize: 20}}>☰</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>PODIUM</Text>
          
          <TouchableOpacity style={styles.iconButton}>
            <Text style={{color:'white', fontSize: 20}}>🔔</Text>
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </View>
        
        {/* Status Badge */}
        <View style={styles.statusBadgeContainer}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? COLORS.success : COLORS.danger }]} />
            <Text style={styles.statusText}>{isOnline ? 'VOCÊ ESTÁ ONLINE' : 'OFFLINE'}</Text>
        </View>
      </View>

      {/* CAMADA 2: CARD DE SOLICITAÇÃO (CONDICIONAL) */}
      {hasRequest && (
        <View style={styles.requestContainer}>
            <View style={styles.requestCard}>
                <View style={styles.requestHeader}>
                    <View style={styles.timeBadge}>
                        <Text style={styles.timeText}>2 MIN</Text>
                    </View>
                    <Text style={styles.distanceText}>2.5 km de distância</Text>
                </View>

                <View style={styles.passengerRow}>
                    <View style={styles.avatarPlaceholder}><Text style={{fontSize:20}}>👤</Text></View>
                    <View style={{flex: 1, marginLeft: 12}}>
                        <Text style={styles.passengerName}>Roberto A.</Text>
                        <Text style={styles.ratingText}>★ 4.9 (Empresa Samsung)</Text>
                    </View>
                    <View>
                        <Text style={styles.priceText}>R$ 85,00</Text>
                        <Text style={styles.priceSubtext}>Fixo</Text>
                    </View>
                </View>

                {/* CAMADA 3: AÇÕES */}
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.declineButton} onPress={() => setHasRequest(false)}>
                        <Text style={styles.declineText}>X</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                        <Text style={styles.acceptText}>ACEITAR CORRIDA</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      )}

      {/* FOOTER (SE NÃO TIVER SOLICITAÇÃO) */}
      {!hasRequest && (
        <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>Veículo Selecionado</Text>
            <View style={styles.vehicleCard}>
                <Text style={{fontSize: 30}}>🚘</Text>
                <View style={{marginLeft: 15}}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Podium Luxo</Text>
                    <Text style={{color: COLORS.textSecondary}}>BMW 320i • ABC-1234</Text>
                </View>
                <Text style={{color: COLORS.primary, marginLeft: 'auto', fontWeight: 'bold'}}>ATIVO</Text>
            </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  statusBadgeContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // REQUEST CARD
  requestContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  requestCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    ...GLOBAL_STYLES.shadow,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  distanceText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  passengerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  priceText: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  priceSubtext: {
    color: COLORS.textSecondary,
    fontSize: 10,
    textAlign: 'right',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  declineButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineText: {
    color: COLORS.danger,
    fontSize: 20,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  // BOTTOM SHEET
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232730',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  }
});