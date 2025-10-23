import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";
//import { getUserProfile, updateUserProfile } from "../../services/userService";

const Profile: React.FC = () => {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [age, setAge] = useState<number>(0);
    const [updatedAt, setUpdatedAt] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const editProfile = () => {
        setIsEditing(true);
    }

    const cancelEdit = () => {
        setIsEditing(false);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        // Lógica para actualizar el perfil del usuario

        setUpdatedAt(new Date().toLocaleDateString());
        setMessage("Perfil actualizado correctamente ✅");
        setIsEditing(false);
        }


    return (
        <div className="profile-wrapper">
            <div className="profile-container">
                <h2>Mi Perfil</h2>
                <form className="profile-form" autoComplete="off">
                    <button type="button" className="edit-button" onClick={editProfile}>Editar Perfil</button>
                    <input
                        type="text"
                        className="first-name-input"
                        placeholder="Nombre"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        readOnly = {!isEditing}
                        required
                    />
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
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly = {!isEditing}
                        required
                    />
                    <button type="submit" disabled={!isEditing} >Guardar cambios</button>
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