import React, { useState } from "react";
import "./Main.css";

export default function Main() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    password: "********",
  });

  const [formData, setFormData] = useState({ ...userData });

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({ ...userData });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setUserData({ ...formData });
    setIsEditing(false);
  };

  const isValidInput = (value) => {
    const regex = /^[a-zA-Z0-9\s@.]*$/;
    return regex.test(value);
  };

  const validateForm = () => {
    return (
      isValidInput(formData.name) &&
      isValidInput(formData.email) &&
      formData.password.length >= 8
    );
  };

  return (
    <div className="container">
      <h1>Hola, estás registrado.</h1>
      <div className="user-info">
        <div key={key} className="info-item">
            <label>{key === "password" ? "Clave" : key[0].toUpperCase() + key.slice(1)}:</label>
            {!isEditing ? (
              <span>{key === "password" ? "********" : userData[key]}</span>
            ) : (
              <input
                type={key === "password" ? "password" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                placeholder={`Editar ${key}`}
                required
              />
            )}
        </div>
        <button className="edit-icon" onClick={toggleEdit}>
          {!isEditing ? "✏️ Editar" : "❌ Cancelar"}
        </button>
        {isEditing && (
          <button
            className="save-button"
            onClick={handleEdit}
            disabled={!validateForm()}
          >
            Guardar
          </button>
        )}
      </div>
    </div>
  );
}
