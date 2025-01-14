import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../Auth.css";
import { login } from "services/auth_api";
import CryptoJS from "crypto-js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showDecryptOption, setShowDecryptOption] = useState(false);
  const [encryptedInput, setEncryptedInput] = useState("");
  const [decryptedPassword, setDecryptedPassword] = useState(""); // Contraseña desencriptada
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (isBlocked) {
      toast.error("Has superado el límite de intentos. (2) Recarga la página para intentarlo de nuevo.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("El correo ingresado no es válido.");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password, "REACT_APP_FRONTEND_SECRET_KEY").toString();
      const loginJson = {
        email: email,
        password: encryptedPassword,
      };

      const response = await login(loginJson);
      if (response.status === 202) {
        navigate("/MyDashboard");
      }
    } catch (error) {
      setLoginAttempts((prevAttempts) => prevAttempts + 1);
      if (error.response && error.response.data && error.response.data.message) {
        // Mostrar el mensaje del backend en el toast
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("No se recibió respuesta del servidor.");
      } else {
        toast.error("Error inesperado al intentar iniciar sesión.");
      }
      if (loginAttempts + 1 >= 2) {
        setIsBlocked(true);
        toast.error("Has superado el límite de intentos fallidos. (2)");
      } else {
        setErrorMessage("Email o contraseña incorrectos. Por favor, intenta de nuevo.");
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const handleForgotPassword = () => {
    navigate("/forgotPassword");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleDecryptPassword = () => {
    try {
      const originalPassword = CryptoJS.AES.decrypt(encryptedInput, process.env.REACT_APP_SECRET_KEY_AES_PASSWORD).toString(CryptoJS.enc.Utf8);
      if (!originalPassword) {
        toast.error("La contraseña encriptada no es válida.");
        return;
      }
      setDecryptedPassword(originalPassword);
      toast.success("Contraseña desencriptada correctamente.");
    } catch (error) {
      toast.error("Error al desencriptar la contraseña.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decryptedPassword);
    toast.success("Contraseña copiada al portapapeles.");
  };

  return (
    <div className="auth">
      <main>
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Insert your email"
              aria-label="Email"
              aria-required="true"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password:</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Insert your password"
                aria-label="Password"
                aria-required="true"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <button type="button" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Sign in</button>
        </form>
        <div className="check-link">
          <Link to="/register">Don't have an account yet? Create an Account</Link>
        </div>
        <div>
          <button type="button" onClick={() => setShowDecryptOption((prev) => !prev)}>
            Decrypt Password
          </button>
          {showDecryptOption && (
            <div className="decrypt-container">
              <input
                type="text"
                placeholder="Paste encrypted password here"
                value={encryptedInput}
                onChange={(e) => setEncryptedInput(e.target.value)}
              />
              <button type="button" onClick={handleDecryptPassword}>
                Decrypt
              </button>
              {decryptedPassword && (
                <div className="decrypted-container">
                  <p>
                    Password:{" "}
                    <span style={{ fontFamily: "monospace" }}>
                      {decryptedPassword.replace(/./g, "•")}
                    </span>
                  </p>
                  <button type="button" onClick={copyToClipboard}>
                    Copy Password
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
