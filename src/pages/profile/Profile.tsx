import React, { useEffect, useState } from "react";
import "./Profile.scss";
import {
  getUserProfile,
  updateUserProfile,
  type ProfileData,
  type UpdateData,
} from "../../services/userService";
import DeleteAccountModal from "../../components/DeleteAccountModal"; // 🆕 Modal importado

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
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false); // 🆕 Estado para el modal

  // 🔹 Habilitar edición
  const editProfile = () => setIsEditing(true);
  const cancelEdit = () => setIsEditing(false);

  // 🔹 Cargar perfil al montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No se encontró el token de autenticación.");

        const data = await getUserProfile(token);
        setProfile(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el perfil."
        );
      }
    };

    fetchProfile();
  }, []);

  // 🔹 Manejo de cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value, // convertir edad a número
    }));
  };

  // 🔹 Enviar formulario
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
      };

      await updateUserProfile(updatedProfile, token);

      setProfile({
        ...profile,
        updatedAt: new Date(),
      });

      setMessage("Perfil actualizado correctamente ✅");
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar el perfil."
      );
    }
  };

  // 🧨 Eliminar cuenta
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró el token.");

      // Aquí puedes usar tu servicio real (o reemplazar con tu API)
      await fetch("https://tuapi.com/api/v1/users/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirige al login tras eliminar la cuenta
    } catch (err) {
      setError("Error al eliminar la cuenta.");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>Mi Perfil</h2>
        <div className="profile-picture">Foto</div>

        <form className="profile-form" autoComplete="off" onSubmit={handleSubmit}>
          <button type="button" className="edit-button" onClick={editProfile}>
            Editar Perfil
          </button>

          <label>Nombre:</label>
          <input
            type="text"
            name="firstName"
            className="first-name-input"
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
            className="last-name-input"
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
            className="age-input"
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
            className="email-input"
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
              onClick={cancelEdit}
            >
              Cancelar
            </button>
          </div>

        {/* Botón para eliminar cuenta */}
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

      {/* 🧩 Modal de confirmación */}
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
