export interface RegisterData {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    securityQuestion: string;
    securityAnswer: string;
}

export interface ProfileData {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    securityQuestion: string;
    securityAnswer: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateData {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
}

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Send user registration data to the backend API.
 * @param data User data for registration
 * @returns Response from the API as JSON
 */
export const registerUser = async (data: RegisterData) => {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Error al registrarse');
        }
        return result;
    } catch (error) {
        console.error('Error en registerUSer:', error);
        throw error;
    };
};

export const getUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    return res.json();
}

export const getUserById = async (id: string) => {
    const res = await fetch (`${API_URL}/users/${id}`);
    if(!res.ok) throw new Error("Error al obtener usuario");
    return res.json();
};


/**
 * Updates the profile of the currently logged-in user.
 * Cookies (HTTP-only) are automatically sent with the request.
 *
 * @param {Partial<UpdateData>} data - The updated profile data.
 * @returns {Promise<any>} The server response after updating the profile.
 * @throws {Error} If the request fails or the server returns an error.
 */
export const updateUserProfile = async (data: Partial<UpdateData>) => {
    const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
    });

    const result = await res.json();
    if(!res.ok) throw new Error(result.message || "Error al actualizar perfil");
    return result;
};


/**
 * Deletes the account of the currently logged-in user.
 * Cookies (HTTP-only) are automatically sent with the request.
 *
 * @returns {Promise<any>} The server response after deleting the profile.
 * @throws {Error} If the request fails or the server returns an error.
 */
export const deleteUserProfile = async () => {
    const res = await fetch (`${API_URL}/users/profile`, {
        method: "DELETE",
        credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al eliminar cuenta");
    return result;
};

export const getSecretQuestion = async (email: string) => {
    const res = await fetch(`${API_URL}/users/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email}),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al obtener pregunta secreta");
    return result;
};


/**
 * Resets the password with a security answer.
 * 
 * @param email - The required user identifier
 * @param securityAnswer - The required answer to verify the user identity.
 * @param newPassword - The password that would be set as new.
 * @returns {Promise<any>} The server response after updating the password.
 * @throws {Error} If the request fails or the server returns an error.
 */
export const resetPasswordWithAnswer = async (
    email: string,
    securityAnswer: string,
    newPassword: string
) => {
    const res = await fetch(`${API_URL}/users/reset-password-secret`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, securityAnswer, newPassword }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al resetear contraseña");
    return result;
};


/**
 * Retrieves the activity history of the currently logged-in user.
 * Cookies (HTTP-only) are automatically sent with the request.
 *
 * @returns {Promise<any>} The user's activity history.
 * @throws {Error} If the request fails or the server returns an error.
 */
export const getActivityHistory = async (token: string) => {
    const res = await fetch(`${API_URL}/users/activity`, {
        credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al obtener historial");
    return result;
}


/**
 * Fetches the profile of the currently logged-in user.
 * Cookies (HTTP-only) are automatically sent with the request.
 *
 * @returns {Promise<ProfileData>} The user's profile data.
 * @throws {Error} If the request fails or the server returns an error.
 */
export const getUserProfile = async () => {
    const res = await fetch(`${API_URL}/users/profile`, {
        method: "GET",
        credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al obtener perfil");
    return result;
}