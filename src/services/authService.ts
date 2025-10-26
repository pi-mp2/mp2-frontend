
export interface LoginData {
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL;


/**
 * Envía credenciales al backend para iniciar sesión
 * @param data - email y contraseña del usuario
 */
export const loginUser = async (data: LoginData) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ⬅️ Envia y recibe cookies
      body: JSON.stringify(data),
    });

    // Si el backend devuelve HTML (error común), lanzamos error
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Respuesta inesperada del servidor. Verifica la URL del backend.");
    }

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || "Error en inicio de sesión.");

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Error al conectar con el servidor.");
  }
};


/**
 * Cierra la sesión del usuario eliminando el token guardado.
 */
export const logoutUser = async () => {
  try {
    // Llama al endpoint de logout del backend
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // Muy importante
    });

    // Borra posibles restos locales
    localStorage.removeItem("token");
  } catch (error: any) {
    console.error("Error al cerrar sesión:", error.message);
  }
};

/**
 * Checks if the user is authenticated.
 * 
 * @returns Serever response checking the user state.
 */
export const checkAuthStatus = async () => {
  const res = await fetch(`${API_URL}/auth/verify`, {
    method: "GET",
    credentials: "include",
  });
  if(!res.ok) throw new Error("No autenticado");
  return res.json();
}