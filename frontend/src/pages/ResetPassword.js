import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../Logo.png";
import "../styles/ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams(); // Get token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill all fields");
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

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/reset-password", {
        token,
        password,
      });

      setMessage("Password has been reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The token may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <div className="reset-password-brand">
          <img src={logo} alt="Sync-Space logo" />
          <div>
            <h2>Reset Password</h2>
            <p>Create a new password for your account.</p>
          </div>
        </div>

        {error && <p className="reset-password-alert reset-password-alert-error">{error}</p>}
        {message && <p className="reset-password-alert reset-password-alert-success">{message}</p>}

        <form className="reset-password-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            className="reset-password-input"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            className="reset-password-input"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button className="reset-password-btn" type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
