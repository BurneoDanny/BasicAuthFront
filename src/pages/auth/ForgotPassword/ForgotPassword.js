import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Auth.css";
import { forgotPassword } from "services/auth_api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true); 

    if (!isValidEmail(email)) {
      setErrorMessage("El correo ingresado no es válido.");
      setIsLoading(false);
      return;
    }

    try {
      const recoveryJson = {
        email: email,
      };

      const response = await forgotPassword(recoveryJson);
      if (response.status === 202) {
        setIsLoading(false); 
        toast.success("Correo enviado exitosamente. Por favor, revisa tu bandeja de entrada.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else if (error.request) {
        setErrorMessage("No se recibió respuesta del servidor.");
      } else {
        setErrorMessage("Ocurrió un error al intentar enviar el correo.");
      }
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="auth">
      {isLoading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <h1>Enviando correo, por favor espere...</h1>
        </div>
      ) : (
        <main>
          <form onSubmit={handleForgotPassword}>
            <div className="input-container">
              <p>
                Ingresa tu correo para recibir tu contraseña cifrada. Luego, sigue el enlace enviado a tu correo para recuperarla.
              </p>
              <label htmlFor="email">Correo:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ingresa tu correo"
                aria-label="Correo"
                aria-required="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit">Enviar correo de recuperación</button>
          </form>
          <div className="check-link">
            <Link to="/">Regresar</Link>
          </div>
        </main>
      )}
      <ToastContainer/>
    </div>
  );
}
