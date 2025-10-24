import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { getUserProfile, updateUserProfile, type ProfileData, type UpdateData } from "../../services/userService";



const Profile: React.FC = () => {
    const [profile, setProfile] = useState<Partial<ProfileData>>({
        firstName: "",
        lastName: "",
        email: "",
        age: 0,
        securityQuestion: "",
        securityAnswer: "",
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const editProfile = () => {
        setIsEditing(true);
    }

    const cancelEdit = () => {
        setIsEditing(false);
    }

    useEffect(() => {
        const fetchProfile = async () => {
            try{
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No se encontró el token de autenticación.");

                const data = await getUserProfile(token);
                setProfile(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar el perfil.");
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!profile) return;
        const {name, value} = e.target;
        setProfile((prev) => ({...prev, [name]: value,}));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!profile) return;

        try {
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");
            if (!token) throw new Error("Falta el token de autenticación.");
            
            const updatedProfile: UpdateData = {
                firstName: profile.firstName ?? "",
                lastName: profile.lastName ?? "",
                age: profile.age ?? 0,
                email: profile.email ?? "",
                securityQuestion: profile.securityQuestion ?? "",
                securityAnswer: profile.securityAnswer ?? "",
                updatedAt: new Date(),
            };

            await updateUserProfile(updatedProfile, token);

            setProfile({
                ...profile,
                updatedAt: new Date(),
            });

            setMessage("Perfil actualizado correctamente ✅");
            setIsEditing(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al actualizar el perfil.");
        }
    }


    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h2>Mi Perfil</h2>
                <form className="profile-form" autoComplete="off" onSubmit={handleSubmit}>
                    <button type="button" className="edit-button" onClick={editProfile}>Editar Perfil</button>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        className="first-name-input"
                        placeholder="Nombre"
                        value={profile?.firstName}
                        onChange={handleChange}
                        readOnly = {!isEditing}
                        required
                    />
                    <label>Apellido:</label>
                    <input
                        type="text"
                        placeholder="Apellido"
                        className="last-name-input"
                        value={profile.lastName}
                        onChange={handleChange}
                        readOnly = {!isEditing}
                        required
                    />
                    <label>Edad:{profile?.age}</label>
                    <label>Correo Electrónico:</label>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="email-input"
                        value={profile?.email}
                        onChange={handleChange}
                        readOnly = {!isEditing}
                        required
                    />

                    <label>Pregunta secreta:</label>
                    <input
                        type="text"
                        name="securityQuestion"
                        value={profile?.securityQuestion}
                        onChange={handleChange}
                        readOnly={!isEditing}
                    />

                    <label>Respuesta secreta:</label>
                    <input
                        type="password"
                        name="securityAnswer"
                        value={profile?.securityAnswer}
                        onChange={handleChange}
                        readOnly={!isEditing}
                    />
                    <button type="submit" disabled={!isEditing}>Guardar cambios</button>
                    <button type="button" className="cancel-edit" disabled={!isEditing} onClick={cancelEdit}>Cancelar</button>
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
                </form>
                {profile.updatedAt && (
                    <label>
                        Fecha de creación:{" "}
                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Desconocida"}
                    </label>
                )}
                {profile.updatedAt && (
                    <label>
                        Última actualización: {" "}
                        {new Date(profile.updatedAt).toLocaleDateString()}
                    </label>
                )}
            </div>
        </div>
    );
}