import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import logo from "../Logo.png";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Block registration completely
    setError("Registration is temporarily disabled to avoid exceeding database limits. Please use the demo login credentials provided in the GitHub README file.");
    return;

    /*
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await api.post("/users", {
        name,
        email,
        password,
        role,
      });

      setMessage("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      const apiError = error.response?.data?.error || error.response?.data?.message;

      if (apiError?.includes("duplicate key")) {
        setError("This email is already registered");
      } else {
        setError(apiError || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-brand">
          <img src={logo} alt="Sync-Space logo" />
          <div>
            <h2>Create Account</h2>
            <p>Join Sync-Space</p>
          </div>
        </div>

        {error && <p className="register-alert register-alert-error">{error}</p>}
        {message && <p className="register-alert register-alert-success">{message}</p>}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            className="register-input"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="register-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              className="register-input"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            className="register-input"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label htmlFor="role">Account Type</label>
          <select
            id="role"
            className="register-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {/* <button className="register-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button> */}
          <button className="register-btn" type="submit" disabled={true}>
            Registration Disabled
          </button>
        </form>

        <p className="register-footer">
          Already have an account?
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
