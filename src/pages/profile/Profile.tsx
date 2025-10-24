import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { getUserById, updateUserProfile } from "../../services/userService";

interface UserProfile {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    secretQuestion: string;
    secretAnswer: string;
    createdAt: string;
    updatedAt: string;
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
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

                //const data = await getUserProfile(token);
                //setProfile(data);
            }
        }
    })


    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h2>Mi Perfil</h2>
                <form className="profile-form" autoComplete="off">
                    <button type="button" className="edit-button" onClick={editProfile}>Editar Perfil</button>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        className="first-name-input"
                        placeholder="Nombre"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        readOnly = {!isEditing}
                        required
                    />
                    <label>Apellido:</label>
                    <input
                        type="text"
                        placeholder="Apellido"
                        className="last-name-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        readOnly = {!isEditing}
                        required
                    />
                    <label>Edad:{age}</label>
                    <label>Correo Electrónico:</label>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly = {!isEditing}
                        required
                    />
                    <button type="submit" disabled={!isEditing} onSubmit={handleSubmit} >Guardar cambios</button>
                    <button type="button" className="cancel-edit" disabled={!isEditing} onClick={cancelEdit}>Cancelar</button>
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}
                </form>
                <label>Fecha de creación: {createdAt}</label>
                <label>Última actualización: {updatedAt}</label>
            </div>
        </div>
    );
}