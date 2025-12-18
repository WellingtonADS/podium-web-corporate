import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AxiosError } from 'axios';
import { PodiumButton } from '../components/PodiumButton';
import { PodiumInput } from '../components/PodiumInput';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      const err = error as AxiosError;
      if (err.code === "ERR_NETWORK") {
        Alert.alert("Erro de Conexão", "Verifique se o backend está rodando e o IP está correto.");
      } else {
        Alert.alert("Falha no Login", "Email ou senha incorretos.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Logo Area */}
        <View style={styles.header}>
          {/* Substitua por sua imagem real depois: require('../../assets/images/logo.png') */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoIcon}>P</Text>
          </View>
          <Text style={styles.title}>PODIUM <Text style={styles.highlight}>DRIVER</Text></Text>
          <Text style={styles.subtitle}>Parceiro Corporativo</Text>
        </View>

        {/* Form Area */}
        <View style={styles.form}>
          <PodiumInput 
            label="Email Corporativo"
            placeholder="motorista@podium.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <PodiumInput 
            label="Senha de Acesso"
            placeholder="••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.spacer} />

          <PodiumButton 
            title="Acessar Painel" 
            onPress={handleLogin} 
            loading={loading} 
          />
          
          <PodiumButton 
            title="Preciso de Ajuda" 
            variant="outline"
            onPress={() => Alert.alert("Suporte", "Contate a central: (92) 9999-9999")}
          />
        </View>

        <Text style={styles.version}>Versão 0.2.0 (Alpha)</Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b1437',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#111c44',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  logoIcon: {
    fontSize: 40,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
  },
  highlight: {
    color: '#D4AF37',
  },
  subtitle: {
    color: '#8f9bba',
    fontSize: 14,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  form: {
    width: '100%',
  },
  spacer: {
    height: 16,
  },
  version: {
    textAlign: 'center',
    color: '#2b3a5a',
    marginTop: 40,
    fontSize: 12,
  },
});