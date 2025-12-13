import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';

// Definição dos Tipos
interface User {
  email: string;
  role: 'admin' | 'driver' | 'employee';
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Criação do Contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      const storagedUser = localStorage.getItem('@Podium:user');
      const storagedToken = localStorage.getItem('@Podium:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storagedToken}`;
      }
      setLoading(false);
    };

    loadStorageData();
  }, []);

  async function signIn({ email, password }: LoginCredentials) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await api.post('/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token } = response.data;

      // Simulando decode do user (num app real usaríamos jwt-decode)
      const userData: User = { email, role: 'admin' };

      localStorage.setItem('@Podium:user', JSON.stringify(userData));
      localStorage.setItem('@Podium:token', access_token);

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(userData);
      
    } catch (error) {
      console.error("Erro no Login:", error);
      throw error;
    }
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
