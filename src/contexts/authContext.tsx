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
  loading: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        setLoading(true);
        console.log('🔍 Verificando estado de autenticación...');
        const data = await checkAuthStatus();
        console.log('📋 Datos recibidos de checkAuthStatus:', data);
        
        // ✅ CORRECCIÓN: Accede a data.user, no a data directamente
        if (data && data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
          console.log('✅ Usuario autenticado:', data.user);
        } else {
          throw new Error('Estructura de respuesta inválida');
        }
      } catch (error) {
        console.error('❌ Error verificando autenticación:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    verifySession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Iniciando login para:', email);
      
      // ✅ Llama a loginUser (esto establece la cookie)
      await loginUser({ email, password });
      console.log('✅ LoginUser completado');
      
      // ✅ Verifica que la sesión esté activa
      const data = await checkAuthStatus();
      console.log('📋 Datos de verificación:', data);
      
      // ✅ CORRECCIÓN: Accede a data.user
      if (data && data.user) {
        setIsAuthenticated(true);
        setUser(data.user);
        console.log('✅ Login exitoso, usuario establecido:', data.user);
      } else {
        throw new Error('No se pudo verificar la sesión después del login');
      }
    } catch (error) {
      console.error('❌ Error en login del contexto:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setIsAuthenticated(false);
      setUser(null);
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};