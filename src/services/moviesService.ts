const API_URL = import.meta.env.VITE_API_URL;

/*
    Tipos de dato
*/
export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string;
  videoUrl?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieData {
  title: string;
  description: string;
  genre: string;
}

export interface UpdateMovieData {
  title?: string;
  description?: string;
  genre?: string;
}

// ========================
// Función auxiliar
// ========================
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ========================
// Servicios principales
// ========================

/** Obtener todas las películas */
export const getMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${API_URL}/movies`);
  if (!res.ok) throw new Error("Error al obtener las películas");
  return res.json();
};

/** Obtener películas del usuario autenticado */
export const getMyMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${API_URL}/movies/my`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener tus películas");
  return res.json();
};

/** Obtener película por ID */
export const getMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`${API_URL}/movies/${id}`);
  if (!res.ok) throw new Error("Película no encontrada");
  return res.json();
};

/** Crear una nueva película (sin video aún) */
export const createMovie = async (data: CreateMovieData): Promise<Movie> => {
  const res = await fetch(`${API_URL}/movies`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear la película");
  return res.json();
};

/** Subir archivo de video */
export const uploadMovieVideo = async (file: File): Promise<{ videoUrl: string }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/movies/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir el video");
  return res.json();
};

/** Actualizar película */
export const updateMovie = async (id: string, data: UpdateMovieData): Promise<Movie> => {
  const res = await fetch(`${API_URL}/movies/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar la película");
  return res.json();
};

/** Eliminar película */
export const deleteMovie = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/movies/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Error al eliminar la película");
};

/** Ver una película (streaming) */
export const watchMovie = async (id: string): Promise<Response> => {
  const res = await fetch(`${API_URL}/movies/watch/${id}`);
  if (!res.ok) throw new Error("Error al reproducir la película");
  return res;
};
