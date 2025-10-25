const API_URL = import.meta.env.VITE_API_URL;


/** 
 * Movie type returned by the API.
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


/**
 * Data required to create a new movie.
 */
export interface CreateMovieData {
  title: string;
  description: string;
  genre: string;
}


/**
 * Data required to update a movie.
 */
export interface UpdateMovieData {
  title?: string;
  description?: string;
  genre?: string;
}




// ========================
// Servicios principales
// ========================

/** 
 * fetches all movies available in the system.
 * 
 * @returns {Promise<Movie[]>} Array of all movies.
 * @throws {Error} If the request fails.
 */
export const getMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${API_URL}/movies`,{
    credentials: "include",
  }
  );
  if (!res.ok) throw new Error("Error al obtener las películas");
  return res.json();
};

/** Fetches movies created by the currently authenticated user.
 * 
 * @returns {Promise<Movie[]>} Array of user's movies.
 * @throws {Error} If the request fails.
 */
export const getMyMovies = async (): Promise<Movie[]> => {
  const res = await fetch(`${API_URL}/movies/my`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al obtener tus películas");
  return res.json();
};

/** 
 * Fetches movies by their ID.
 * 
 * @param {string} id - The ID of the movie.
 * @returns {Promise<Movie>} Movie object.
 * @throws {Error} If the movie is not found.
*/
export const getMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`${API_URL}/movies/${id}`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Película no encontrada");
  return res.json();
};

/** 
 * Creates a new movie (without uploading video yet).
 * 
 * @param {CreateMovieData} data - Data for the new movie.
 * @returns {Promise<Movie>} The created movie.
 * @throws {Error} If creation fails.
*/
export const createMovie = async (data: CreateMovieData): Promise<Movie> => {
  const res = await fetch(`${API_URL}/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear la película");
  return res.json();
};

/** 
 * Uploads the video file for a movie.
 * 
 * @param {File} file - The video file to upload.
 * @returns {Promise<{ videoUrl: string }>} Object containing the video URL.
 * @throws {Error} If upload fails.
*/
export const uploadMovieVideo = async (file: File): Promise<{ videoUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/movies/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al subir el video");
  return res.json();
};

/** 
 * Updates an existing movie by ID.
 * 
 * @param {string} id - The ID of the movie to update.
 * @param {UpdateMovieData} data - Partial data to update.
 * @returns {Promise<Movie>} The updated movie object.
 * @throws {Error} If update fails.
*/
export const updateMovie = async (id: string, data: UpdateMovieData): Promise<Movie> => {
  const res = await fetch(`${API_URL}/movies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json"},
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar la película");
  return res.json();
};

/** 
 * Deletes a movie by ID.
 * 
 * @param {string} id - The ID of the movie to delete.
 * @returns {Promise<void>} No return value.
 * @throws {Error} If deletion fails.
*/
export const deleteMovie = async (id: string): Promise<void> => {
  const res = await fetch(`${API_URL}/movies/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar la película");
};

/** 
 * Fetches the streaming URL of a movie for watching.
 * 
 * @param {string} id - The ID of the movie.
 * @returns {Promise<Response>} The fetch Response object (streaming).
 * @throws {Error} If streaming fails.
*/
export const watchMovie = async (id: string): Promise<Response> => {
  const res = await fetch(`${API_URL}/movies/watch/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al reproducir la película");
  return res;
};
