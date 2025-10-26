import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { loginUser, logoutUser, checkAuthStatus } from "../services/authService";

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar sesión activa mediante cookie HTTP-only
    const verifySession = async () => {
      try {
        const data = await checkAuthStatus();
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    verifySession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginUser({email, password});
      const verifiedUser = await checkAuthStatus();
      if(verifiedUser) {
        setIsAuthenticated(true);
        setUser(verifiedUser);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
