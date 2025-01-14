import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Auth.css";
import { register } from "services/auth_api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSecondPassword, setShowSecondPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true); // Mostrar el loader

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false); // Ocultar el loader
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
      const registerJson = {
        email: email,
        username: username,
        password: password,
      };

      const response = await register(registerJson);
      console.log(response);
      if (response.status === 201) {
        setIsRegistered(true);
        setSuccessMessage(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
    } else if (error.request) {
        setErrorMessage("No se recibió respuesta del servidor.");
    } else {
        setErrorMessage("Ocurrió un error al intentar registrarse.");
    }
      console.error("Register failed", error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleSecondPasswordVisibility = () => {
    setShowSecondPassword((prev) => !prev);
  };

  return (
    <div className="auth">
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <h1>Registrando, espere un momente por favor.</h1>
        </div>
      ) : (
        <main>
          {isRegistered ? (
            <div className="success-message">
              <h2>{successMessage || "Registration successful!"}</h2>
              <Link to="/">Go to login</Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleRegister}>
                <div className="input-container">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Insert your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="email">Username:</label>
                  <input
                    type="username"
                    id="username"
                    name="username"
                    placeholder="Insert your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                      placeholder="Create a password"
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
                </div>
                <div className="input-container">
                  <label htmlFor="confirmPassword">Confirm Password:</label>
                  <div className="password-container">
                    <input
                      type={showSecondPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={toggleSecondPasswordVisibility}
                      aria-label={showSecondPassword ? "Hide password" : "Show password"}
                    >
                      {showSecondPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Register</button>
              </form>
              <div className="check-link">
                <Link to="/">Already have an account? Sign in</Link>
              </div>
            </>
          )}
        </main>
      )}
    </div>
  );
}
