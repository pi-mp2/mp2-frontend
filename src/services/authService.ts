import axiosClient from "./axiosClient";

export interface LoginData {
  email: string;
  password: string;
}

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Envía credenciales al backend para iniciar sesión
 * (si tu backend devuelve cookie httpOnly, mantenemos credentials: "include")
 */
export const loginUser = async (data: LoginData) => {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Respuesta inesperada del servidor. Verifica la URL del backend.");
    }

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error en inicio de sesión.");

    return result; // { status, message, data: { token?, user? } }
  } catch (error: any) {
    throw new Error(error.message || "Error al conectar con el servidor.");
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logoutUser = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("token");
  } catch (error: any) {
    console.error("Error al cerrar sesión:", error.message);
  }
};

/**
 * ✅ Verifica si la sesión sigue siendo válida.
 * Envía cookie httpOnly (withCredentials) y, si existe, también el Bearer.
 */
export const checkAuthStatus = async () => {
  const { data } = await axiosClient.get("/auth/verify");
  return data; // lo que devuelva tu backend (p.ej. { ok: true, user: {...} })
};
