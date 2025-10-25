import React, { useEffect, useState } from "react";
import "./Profile.scss";
import {
  getUserProfile,
  updateUserProfile,
  type ProfileData,
  type UpdateData,
} from "../../services/userService";
import DeleteAccountModal from "../../components/DeleteAccountModal";

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

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No se encontró el token de autenticación.");

        const data = await getUserProfile(token);
        setProfile(data);
        if (data.profileImage) setProfileImage(data.profileImage);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el perfil."
        );
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setProfileImage(imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        profileImage: profileImage ?? "",
      };

      await updateUserProfile(updatedProfile, token);
      setProfile({ ...profile, updatedAt: new Date() });
      setMessage("Perfil actualizado correctamente ✅");
      setIsEditing(false);
    } catch (err) {
      setError("Error al actualizar el perfil.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró el token.");
      const API_BASE_URL = import.meta.env.VITE_API_URL;

      await fetch(`${API_BASE_URL}/users/delete`, {
      method: "DELETE",
      headers: {
      Authorization: `Bearer ${token}`,
      },
      });

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      setError("Error al eliminar la cuenta.");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>Mi Perfil</h2>

        {/* 🔹 Imagen de perfil debajo del título */}
        <div className="profile-image-container">
          <img
            src={previewUrl || profileImage || "/default-avatar.png"}
            alt={
              profile.firstName
                ? `Foto de perfil de ${profile.firstName}`
                : "Foto de perfil predeterminada"
            }
            className="profile-image"
          />

          {isEditing && (
            <div className="image-buttons">
              <label htmlFor="imageUpload" className="upload-label">
                Cambiar imagen
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="remove-image-btn"
                >
                  Quitar imagen
                </button>
              )}
            </div>
          )}
        </div>

        {/* 🔹 Botón de editar debajo de la imagen */}
        <div className="edit-profile-section">
          <button
            type="button"
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Editar Perfil
          </button>
        </div>

        <form
          className="profile-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <label>Nombre:</label>
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={profile.firstName ?? ""}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />

          <label>Apellido:</label>
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={profile.lastName ?? ""}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />

          <label>Edad:</label>
          <input
            type="number"
            name="age"
            placeholder="Edad"
            value={profile.age ?? 0}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />

          <label>Correo Electrónico:</label>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={profile.email ?? ""}
            onChange={handleChange}
            readOnly={!isEditing}
            required
          />

          <label>Pregunta secreta:</label>
          <input
            type="text"
            name="securityQuestion"
            placeholder="Pregunta secreta"
            value={profile.securityQuestion ?? ""}
            onChange={handleChange}
            readOnly={!isEditing}
          />

          <label>Respuesta secreta:</label>
          <input
            type="password"
            name="securityAnswer"
            placeholder="Respuesta secreta"
            value={profile.securityAnswer ?? ""}
            onChange={handleChange}
            readOnly={!isEditing}
          />

          <div className="form-buttons">
            <button type="submit" disabled={!isEditing}>
              Guardar cambios
            </button>
            <button
              type="button"
              className="cancel-edit"
              disabled={!isEditing}
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </button>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="delete-account-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Eliminar cuenta
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </form>

        <div className="profile-dates">
          {profile.createdAt && (
            <p>
              <strong>Fecha de creación:</strong>{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          )}
          {profile.updatedAt && (
            <p>
              <strong>Última actualización:</strong>{" "}
              {new Date(profile.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
