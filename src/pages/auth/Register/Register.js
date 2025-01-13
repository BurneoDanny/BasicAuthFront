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
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const registerJson = {
        email: email,
        password: password,
      };

      await register(registerJson);
      navigate("/MyDashboard");
    } catch (error) {
      setErrorMessage("Error creating account. Please try again.");
      console.error("Register failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleSecondPasswordVisibility = () => {
    setShowSecondPassword((prev) => !prev);
  };

  return (
    <div className="auth">
      <main>
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
      </main>
    </div>
  );
}
