import React, { useState } from "react";
import { type UpdateData, type ProfileData } from "../../services/userService";

interface Props {
    profile: Partial<ProfileData>;
    onSave: (updatedData: UpdateData) => Promise<void>;
    onCancel: () => void;
}

const EditProfile: React.FC<Props> = ({ profile, onSave, onCancel }) => {
    const [formData, setFormData] = useState<UpdateData>({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        age: profile.age || 0,
        email: profile.email || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "age" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="form-grid">
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Apellidos:
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Apellidos:
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Edad:
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div className="buttons">
                <button type="submit">Guardar</button>
                <button type="button" className="cancel" onClick={onCancel}>
                    Descartar
                </button>
            </div>
        </form>
    )
};

export default EditProfile;