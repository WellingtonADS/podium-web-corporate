import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

interface AuthContextData {
  signed: boolean;
  user: object | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await SecureStore.getItemAsync('podium_user');
      const storagedToken = await SecureStore.getItemAsync('podium_token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(email: string, pass: string) {
    // Monta manualmente o corpo x-www-form-urlencoded para evitar problemas com URLSearchParams no RN
    const body = `username=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`;

    const response = await api.post('/login', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    
    // Simulando dados do user (idealmente viria do backend)
    const userData = { email, role: 'driver' };

    // IMPORTANTE: Salva o token ANTES de setar o user para garantir que o interceptor encontre
    await SecureStore.setItemAsync('podium_token', access_token);
    await SecureStore.setItemAsync('podium_user', JSON.stringify(userData));
    
    console.log('[AUTH] Token salvo com sucesso');
    
    setUser(userData);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('podium_token');
    await SecureStore.deleteItemAsync('podium_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}