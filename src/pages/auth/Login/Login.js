import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Auth.css";
import { login } from "services/auth_api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const loginJson = {
        email: email,
        password: password,
      };

      await login(loginJson);
      navigate("/MyDashboard");
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
      console.error("Login failed");
    }
  };

  const handleForgotPassword = () => {
    // lógica para recuperar la contraseña
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth">
      <main>
        <form onSubmit={handleLogin} action="/MyDashboard" method="post">
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
          <Link to="/register">
            Don't have an account yet? Create an Account
          </Link>
        </div>
      </main>
    </div>
  );
}
