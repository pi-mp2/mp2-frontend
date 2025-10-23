export interface RegisterData {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
}

/**
 * Send user registration data to the backend API.
 * @param data User data for registration
 * @returns Response from the API as JSON
 */
export const registerUser = async (data: RegisterData) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
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