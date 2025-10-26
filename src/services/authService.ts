export interface LoginData {
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Envía credenciales al backend para iniciar sesión
 */
export const loginUser = async (data: LoginData) => {
  try {
    console.log('🌐 Enviando login a:', `${API_URL}/auth/login`);
    
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    console.log('📨 Respuesta del login - Status:', res.status);

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await res.text();
      console.error('❌ Respuesta no JSON:', textResponse.substring(0, 200));
      throw new Error("Respuesta inesperada del servidor. Verifica la URL del backend.");
    }

    const result = await res.json();
    console.log('📋 Resultado del login:', result);

    if (!res.ok) {
      throw new Error(result.message || "Error en inicio de sesión.");
    }

    return result;
  } catch (error: any) {
    console.error('💥 Error en loginUser:', error);
    throw new Error(error.message || "Error al conectar con el servidor.");
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logoutUser = async () => {
  try {
    console.log('🌐 Enviando logout');
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error('Error en logout');
    }

    localStorage.removeItem("token");
    console.log('✅ Logout completado');
  } catch (error: any) {
    console.error("❌ Error al cerrar sesión:", error.message);
    throw error;
  }
};

/**
 * Verifica el estado de autenticación
 */
export const checkAuthStatus = async () => {
  try {
    console.log('🔍 Verificando autenticación...');
    const res = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      credentials: "include",
    });
    
    console.log('📨 Respuesta de verify - Status:', res.status);
    
    if (!res.ok) {
      throw new Error("No autenticado");
    }

    const data = await res.json();
    console.log('📋 Datos de autenticación:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Error en checkAuthStatus:', error);
    throw error;
  }
}