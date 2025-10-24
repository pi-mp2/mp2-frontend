export interface RegisterData {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    secretQuestion: string;
    secretAnswer: string;
}

export interface UpdateData {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    secretQuestion: string;
    secretAnswer: string;
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

export const updateUserProfile = async (data: Partial<UpdateData>, token: string) => {
    const res = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    const result = await res.json();
    if(!res.ok) throw new Error(result.message || "Error al actualizar perfil");
    return result;
};

export const deleteUserProfile = async (token: string) => {
    const res = await fetch (`${API_URL}/users/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`},
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

export const resetPasswordWithAnswer = async (
    email: string,
    secretAnswer: string,
    newPassword: string
) => {
    const res = await fetch(`${API_URL}/users/reset-password-secret`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, secretAnswer, newPassword }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al resetear contraseña");
    return result;
};

export const getActivityHistory = async (token: string) => {
    const res = await fetch(`${API_URL}/users/activity`, {
        headers: {Autorization: `Bearer ${token}`},
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Error al obtener historial");
    return result;
}