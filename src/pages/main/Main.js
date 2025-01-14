import React, { useEffect, useState } from "react";
import "./Main.css";
import { ToastContainer, toast } from "react-toastify";
import { updateUser, updatePassword, logout } from "services/auth_api";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
export default function Main() {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setUserData(parsedData);
      setFormData(parsedData);
    }
  }, []);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({ ...userData });
    }
  };

  const toggleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    if (!formData.email || !formData.username) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }
    try {
      const userId = userData.id;
      const updateUserJson = {
        email: formData.email,
        username: formData.username,
      };
      const response = await updateUser(updateUserJson, userId);

      if (response.status === 200) {
        const { email, username, id } = response.data;
        const decryptedUsername = CryptoJS.AES.decrypt(
          username,
          process.env.REACT_APP_SECRET_KEY_AES_PASSWORD
        ).toString(CryptoJS.enc.Utf8);
        const updatedData = { email, username: decryptedUsername, id };
        setUserData(updatedData);
        localStorage.setItem("userData", JSON.stringify(updatedData));
        setIsEditing(false);
        toast.success("Datos actualizados correctamente");
      } else {
        throw new Error("Error inesperado al actualizar los datos");
      }
    } catch (error) {
      toast.error("Error al actualizar los datos. Inténtalo de nuevo.");
    }
  };

  const handlePasswordSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las nuevas contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const userId = userData.id;
      const response = await updatePassword({ oldPassword, newPassword }, userId);

      if (response.status === 200) {
        toast.success("Contraseña actualizada correctamente.");
        setIsChangingPassword(false);
      } else {
        throw new Error("Error inesperado al actualizar la contraseña.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al actualizar la contraseña.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout({ email: userData.email });
      if (response.status === 200) {
        localStorage.removeItem("userData");
        toast.success("Sesión cerrada correctamente.");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        throw new Error("Error inesperado al cerrar sesión.");
      }
    } catch (error) {
      toast.error("Error al cerrar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="container">
      <h1>Hola, Bienvenid@!!</h1>
      <div className="user-info">
        {!isChangingPassword ? (
          <>
            <div className="info-item">
              <label>Email:</label>
              {!isEditing ? (
                <span>{formData.email}</span>
              ) : (
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Edita tu correo"
                  required
                />
              )}
            </div>
            <div className="info-item">
              <label>Username:</label>
              {!isEditing ? (
                <span>{formData.username}</span>
              ) : (
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Edita tu nombre de usuario"
                  required
                />
              )}
            </div>
            <button className="edit-icon" onClick={toggleEdit}>
              {!isEditing ? "✏️ Editar" : "❌ Cancelar"}
            </button>
            {isEditing && (
              <button className="save-button" onClick={handleEdit}>
                Guardar
              </button>
            )}
            <div className="info-item">
              <label>Password:</label>
              <button onClick={toggleChangePassword}>Change Password</button>
            </div>
            <div className="info-item">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="info-item">
              <label>Old Password:</label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                placeholder="Contraseña actual"
                required
              />
            </div>
            <div className="info-item">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Nueva contraseña"
                required
              />
            </div>
            <div className="info-item">
              <label>Confirm New Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirma nueva contraseña"
                required
              />
            </div>
            <button className="save-button" onClick={handlePasswordSubmit}>
              Guardar Contraseña
            </button>
            <button className="edit-icon" onClick={toggleChangePassword}>
              ❌ Cancelar
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
