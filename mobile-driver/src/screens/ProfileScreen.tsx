import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, GLOBAL_STYLES } from '../theme';

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <ScrollView style={GLOBAL_STYLES.container} contentContainerStyle={{paddingBottom: 40}}>
      
      {/* HERO SECTION */}
      <View style={styles.hero}>
        <Text style={styles.headerTitle}>PROFILE</Text>
        
        <View style={styles.avatarContainer}>
            <View style={styles.ringOuter}>
                <View style={styles.ringInner}>
                    {/* Placeholder para foto */}
                    <View style={styles.avatar} />
                </View>
            </View>
            <View style={styles.starBadge}>
                <Text>⭐</Text>
            </View>
        </View>

        <Text style={styles.eliteTag}>MOTORISTA ELITE</Text>
        <Text style={styles.name}>João da Silva</Text>
        <Text style={styles.rating}>4.95 ★★★★★</Text>
      </View>

      {/* INFO BLOCK */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
            <Text style={styles.statValue}>1,250</Text>
            <Text style={styles.statLabel}>Viagens</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
            <Text style={styles.statValue}>2 anos</Text>
            <Text style={styles.statLabel}>Parceiro</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Aceite</Text>
        </View>
      </View>

      {/* FINANCIAL HIGHLIGHT */}
      <View style={styles.financialCard}>
        <Text style={styles.financialLabel}>GANHOS HOJE</Text>
        <Text style={styles.financialValue}>R$ 450,00</Text>
        <Text style={styles.financialSub}>Meta diária: 90% atingida</Text>
      </View>

      {/* SETTINGS LIST */}
      <View style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Dados do Veículo</Text>
            <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Documentos</Text>
            <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Configurações</Text>
            <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>FICAR OFFLINE (SAIR)</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: 60, marginBottom: 30 },
  headerTitle: { color: COLORS.textSecondary, letterSpacing: 2, marginBottom: 30 },
  
  avatarContainer: { position: 'relative', marginBottom: 20 },
  ringOuter: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  ringInner: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 2, borderColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  avatar: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#333' },
  starBadge: {
    position: 'absolute', bottom: 0, right: 10,
    backgroundColor: COLORS.primary, width: 32, height: 32,
    borderRadius: 16, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.background
  },
  
  eliteTag: { color: COLORS.primary, fontWeight: 'bold', letterSpacing: 2, fontSize: 12, marginBottom: 8 },
  name: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  rating: { color: COLORS.textSecondary, marginTop: 4 },

  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  statLabel: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  divider: { width: 1, backgroundColor: '#333' },

  financialCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    marginBottom: 30,
  },
  financialLabel: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  financialValue: { color: COLORS.primary, fontSize: 36, fontWeight: 'bold', marginVertical: 8 },
  financialSub: { color: COLORS.textSecondary, fontSize: 12 },

  menuList: { marginHorizontal: 20, marginBottom: 30 },
  menuItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#222'
  },
  menuText: { color: 'white', fontSize: 16 },
  menuArrow: { color: 'gray', fontSize: 18 },

  logoutButton: {
    marginHorizontal: 20,
    height: 55,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: { color: COLORS.danger, fontWeight: 'bold' }
});