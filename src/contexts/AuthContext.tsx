import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api, { fetchCurrentUser, User } from "../services/api";

const TOKEN_STORAGE_KEY = "@Podium:token";
const USER_STORAGE_KEY = "@Podium:user";

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
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthHeader = (token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const persistUser = (profile: User) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  const fetchAndPersistProfile = async () => {
    const profile = await fetchCurrentUser();
    persistUser(profile);
    return profile;
  };

  useEffect(() => {
    const loadStorageData = async () => {
      const storagedUser = localStorage.getItem(USER_STORAGE_KEY);
      const storagedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (!storagedToken) {
        setLoading(false);
        return;
      }

      setAuthHeader(storagedToken);

      if (storagedUser) {
        setUser(JSON.parse(storagedUser));
      }
      try {
        const profile = await fetchCurrentUser();
        persistUser(profile);
      } catch (error) {
        console.error("Erro ao sincronizar perfil do usuário:", error);
        signOut();
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn({ email, password }: LoginCredentials) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await api.post("/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token } = response.data;

      setAuthHeader(access_token);
      localStorage.setItem(TOKEN_STORAGE_KEY, access_token);

      await fetchAndPersistProfile();
    } catch (error) {
      console.error("Erro no Login:", error);
      signOut();
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    api.defaults.headers.common["Authorization"] = undefined;
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
