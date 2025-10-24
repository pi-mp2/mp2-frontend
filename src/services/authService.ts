// src/services/authService.ts
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
      credentials: "include",
      body: JSON.stringify(data),
    });

    // Si el backend devuelve HTML (error común), lanzamos error
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Respuesta inesperada del servidor. Verifica la URL del backend.");
    }

    const result = await res.json();

    if (!res.ok) throw new Error(result.message || "Error en inicio de sesión.");

    // Guardar token en localStorage
    if (result.data?.token) {
      localStorage.setItem("token", result.token);
    }

    return result;
  } catch (error: unknown) {
    let message = "Error al conectar con el servidor.";
    if (error instanceof Error && error.message) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else {
      try {
        message = JSON.stringify(error);
      } catch {
        // leave default message
      }
    }
    throw new Error(message);
  }
};

/**
 * Cierra la sesión del usuario eliminando el token guardado.
 */
export const logoutUser = () => {
  localStorage.removeItem("token");
};


