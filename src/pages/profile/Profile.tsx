import React, { useEffect, useState } from "react";
import "./Profile.scss";
import {
    deleteUserProfile,
  getUserProfile,
  updateUserProfile,
  type ProfileData,
  type UpdateData,
} from "../../services/userService";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import EditProfile from "./EditProfile";
import { logoutUser } from "../../services/authService";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Partial<ProfileData>>({});
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        setError("Error al cargar el perfil.");
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (updatedData: UpdateData) => {
    try {
        await updateUserProfile(updatedData);
        setMessage("Perfil actualizado correctamente.");
        setIsEditing(false);
    } catch {
        setError("Error al actualizar el perfil.")
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserProfile();
      logoutUser();
    } catch (err) {
      setError("Error al eliminar la cuenta.");
    }
  };

  return (
    <div className="profile-wrapper">
      <header className="profile-header">
        <h2>Perfil</h2>
      </header>

      <div className="profile-content">
        <div className="profile-left">
            <div className="profile-avatar">
                <img
                    src= "https://freesvg.org/img/defaultprofile.png"
                    alt= "Foto de perfil"
                />
            </div>
            <button
                className="delete-btn"
                onClick={() => setShowDeleteModal(true)}>
                    Eliminar cuenta
            </button>
        </div>

        <div className="profile-right">
            {isEditing ? (
                <EditProfile
                    profile={profile}
                    onCancel={() => setIsEditing(false)}
                    onSave={handleSave}
                />
            ) : (
                <div className="profile-info">
                    <div className="info-grid">
                        <p><strong>Nombre:</strong> {profile.firstName} </p>
                        <p><strong>Apellidos:</strong> {profile.lastName} </p>
                        <p><strong>Edad:</strong> {profile.age} </p>
                        <p><strong>E-mail:</strong> {profile.email} </p>
                    </div>

                    <div className="profile-dates"> 
                        <p><strong>Fecha de creación:</strong> {profile.createdAt} </p>
                        <p><strong>Última modificación:</strong> {profile.updatedAt} </p>
                    </div>

                    <div className="buttons">
                        <button onClick={() => setIsEditing(true)}>Editar</button>
                    </div>
                </div>
            )}
        </div>
      </div>

        {(error || message) && (
            <div className="feedback">
                {error && <p className="error">{error}</p>}
                {message && <p className="success">{message}</p>}
            </div>
        )}

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
