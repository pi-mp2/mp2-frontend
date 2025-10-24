import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

// 🟢 1. Crea el contexto ANTES del provider
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
} | null>(null);

// 🟢 2. Define el provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const isAuthenticated = !!token;

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🟢 3. (opcional) Hook de conveniencia
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return context;
};
