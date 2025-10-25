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
      await fetch("https://tuapi.com/api/v1/users/delete", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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

        {/* Heurística 4: Consistencia y estándares → mismos estilos que Login */}
        <form className="profile-form" autoComplete="off" onSubmit={handleSubmit}>
          {/* Heurística 2: Control del usuario → puede editar o cancelar */}
          <button type="button" className="edit-button" onClick={() => setIsEditing(true)}>
            Editar Perfil
          </button>

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

          {/* Heurística 3: Prevención de errores → campo numérico */}
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

          {/* Heurística 6: Reconocer antes que recordar → placeholders descriptivos */}
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

          {/* Heurística 2: Libertad del usuario → puede eliminar cuenta */}
          <div className="form-buttons">
            <button
              type="button"
              className="delete-account-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              Eliminar cuenta
            </button>
          </div>

          {/* Heurística 1: Visibilidad → mensajes de estado */}
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </form>

        {/* Heurística 5: Ayuda → fechas visibles de cambios */}
        <div className="profile-dates">
          {profile.createdAt && (
            <p><strong>Fecha de creación:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
          )}
          {profile.updatedAt && (
            <p><strong>Última actualización:</strong> {new Date(profile.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      {/* Heurística 2: Control → modal de confirmación */}
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
