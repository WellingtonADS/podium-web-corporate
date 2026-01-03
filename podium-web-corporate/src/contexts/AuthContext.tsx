import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";
import { LoginCredentials, User } from "../types";
interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
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
      const storagedUser = localStorage.getItem("@Podium:user");
      const storagedToken = localStorage.getItem("@Podium:token");

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        api.defaults.headers.common["Authorization"] =
          `Bearer ${storagedToken}`;
      }
      setLoading(false);
    };

    loadStorageData();
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

      // Define o token no header ANTES de outras requisições
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      localStorage.setItem("@Podium:token", access_token);

      // 🔥 MUDANÇA: Buscar perfil real do backend em vez de mockar
      try {
        const userResponse = await api.get<User>("/users/me");
        const userData = userResponse.data;

        localStorage.setItem("@Podium:user", JSON.stringify(userData));
        setUser(userData);
      } catch (profileError) {
        console.error("Erro ao carregar perfil do usuário:", profileError);
        // Fallback: se não conseguir carregar o perfil, usar dados do login
        const userData: User = {
          id: 1,
          email: email,
          full_name: email.split("@")[0],
          role: "employee",
          is_active: true,
        };
        localStorage.setItem("@Podium:user", JSON.stringify(userData));
        setUser(userData);
      }
    } catch (error) {
      console.error("Erro no Login:", error);
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem("@Podium:token");
    localStorage.removeItem("@Podium:user");
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
  return context;
}
