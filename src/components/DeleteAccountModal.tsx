import React from "react";
import "./DeleteAccountModal.scss";

interface DeleteAccountModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3>¿Seguro que quieres eliminar tu cuenta?</h3>
        <p>Esta acción es permanente y no podrás recuperarla.</p>
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            Cancelar
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
