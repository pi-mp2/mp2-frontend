import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";

type User = {
  id?: string;
  username?: string;
  name?: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  isAuth: boolean | null; // null = no verificado aún
  loading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔍 Verificar sesión al cargar la app
  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axiosClient.get("/auth/verify");
        console.log("✅ Verificación exitosa:", data);
        setUser(data?.user ?? null);
        setIsAuth(true);
      } catch (error: any) {
        console.warn("❌ No autenticado:", error.response?.status);
        setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  // 🔐 Iniciar sesión
  const login: AuthContextType["login"] = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data } = await axiosClient.post("/auth/login", { email, password });
      setUser(data?.user ?? null);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Cerrar sesión
  const logout: AuthContextType["logout"] = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch {}
    localStorage.removeItem("token");
    setUser(null);
    setIsAuth(false);
  };

  // 🔄 Refrescar sesión
  const refresh: AuthContextType["refresh"] = async () => {
    try {
      const { data } = await axiosClient.get("/auth/verify");
      setUser(data?.user ?? null);
      setIsAuth(true);
    } catch {
      setUser(null);
      setIsAuth(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
