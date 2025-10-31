import React, { createContext, useContext, useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";

type User = {
  id?: string;
  _id?: string;
  email?: string;
  username?: string;
  name?: string;
  [k: string]: any;
};

type AuthContextType = {
  user: User | null;
  isAuth: boolean | undefined; // undefined mientras carga
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuth: undefined,
  loading: true,
  // stubs
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data } = await axiosClient.get("/auth/verify");
      // Si tu backend devuelve {user} o {data:{user}} ajusta aquí:
      const u = data?.user ?? data?.data?.user ?? data;
      setUser(u || null);
      setIsAuth(true);
    } catch (err: any) {
      // 401 => no autenticado
      setUser(null);
      setIsAuth(false);
      // Limpia cualquier token local por si acaso
      localStorage.removeItem("token");
    }
  };

  const login = async (email: string, password: string) => {
    // IMPORTANTÍSIMO: coincide con el contrato del backend.
    // Si tu backend espera "correo" en vez de "email", cambia la clave.
    try {
      const { data } = await axiosClient.post("/auth/login", { email, password });
      // Si tu backend devuelve token en data.token, guarda (opcional):
      const token = data?.token ?? data?.data?.token;
      if (token) localStorage.setItem("token", token);

      // Establece user directo si viene en la respuesta, si no, pregunta a /verify
      const u = data?.user ?? data?.data?.user;
      if (u) {
        setUser(u);
        setIsAuth(true);
      } else {
        await refresh();
      }
    } catch (err: any) {
      // Propaga mensaje útil
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo iniciar sesión.";
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch {
      // aunque falle, limpia local
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuth(false);
    }
  };

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuth, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
