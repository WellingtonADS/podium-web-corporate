import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { COLORS, GLOBAL_STYLES } from '../theme';

// Mock Data
const TRANSACTIONS = [
  { id: 1, date: 'Hoje, 14:30', amount: 'R$ 45,00', type: 'Podium Luxo' },
  { id: 2, date: 'Hoje, 13:15', amount: 'R$ 32,50', type: 'Podium Exec' },
  { id: 3, date: 'Hoje, 10:00', amount: 'R$ 85,00', type: 'Podium Luxo' },
  { id: 4, date: 'Ontem', amount: 'R$ 120,00', type: 'Podium Luxo' },
];

const ChartBar = ({ height, day, active }: any) => (
    <View style={{alignItems: 'center', marginHorizontal: 6}}>
        <View style={{
            width: 8, 
            height: 100, 
            backgroundColor: '#222', 
            borderRadius: 4, 
            justifyContent: 'flex-end'
        }}>
            <View style={{
                width: 8, 
                height: height, 
                backgroundColor: active ? COLORS.primary : '#444', 
                borderRadius: 4 
            }} />
        </View>
        <Text style={{color: active ? 'white' : 'gray', fontSize: 10, marginTop: 8}}>{day}</Text>
    </View>
);

export default function EarningsScreen() {
  return (
    <View style={GLOBAL_STYLES.container}>
      <View style={styles.header}>
        <Text style={GLOBAL_STYLES.title}>Earnings</Text>
        <View style={styles.tabContainer}>
            <View style={styles.tabActive}><Text style={styles.tabTextActive}>Today</Text></View>
            <View style={styles.tabInactive}><Text style={styles.tabTextInactive}>Bonus</Text></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{padding: 20}}>
        
        {/* TOTAL CARD */}
        <View style={styles.totalCard}>
            <Text style={{color: COLORS.textSecondary}}>Total Balance</Text>
            <Text style={{color: 'white', fontSize: 40, fontWeight: 'bold', marginVertical: 10}}>R$ 1.250,00</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: COLORS.success}}>+12% </Text>
                <Text style={{color: 'gray'}}>vs last week</Text>
            </View>
        </View>

        {/* CHART AREA */}
        <View style={styles.chartContainer}>
            <Text style={{color: 'white', fontWeight: 'bold', marginBottom: 20}}>Weekly Report</Text>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <ChartBar day="S" height="40%" />
                <ChartBar day="M" height="60%" />
                <ChartBar day="T" height="30%" />
                <ChartBar day="W" height="80%" active />
                <ChartBar day="T" height="50%" />
                <ChartBar day="F" height="90%" />
                <ChartBar day="S" height="70%" />
            </View>
        </View>

        {/* LIST */}
        <Text style={{color: 'white', fontWeight: 'bold', marginBottom: 10, marginTop: 10}}>Recent Payouts</Text>
        {TRANSACTIONS.map(t => (
            <View key={t.id} style={styles.transactionRow}>
                <View>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>{t.type}</Text>
                    <Text style={{color: 'gray', fontSize: 12}}>{t.date}</Text>
                </View>
                <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>{t.amount}</Text>
            </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: COLORS.surface },
  tabContainer: { flexDirection: 'row', marginTop: 20 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: COLORS.primary, paddingBottom: 10, marginRight: 20 },
  tabInactive: { paddingBottom: 10 },
  tabTextActive: { color: COLORS.primary, fontWeight: 'bold' },
  tabTextInactive: { color: 'gray' },

  totalCard: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333'
  },
  chartContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222'
  }
});
