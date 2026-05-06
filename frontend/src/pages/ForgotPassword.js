import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../Logo.png";
import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/forgot-password", { email });
      
      // In a real app, you would email the token to the user.
      // For this guide, we'll display it so you can test the reset flow.
      const { resetToken } = res.data;
      setMessage(`A reset token has been generated. In a real app, this would be emailed. You can use this token to reset your password.`);
      
      // This makes it easy to click the link during development
      console.log(`Password Reset Link for Dev: http://localhost:3000/reset-password/${resetToken}`);

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-brand">
          <img src={logo} alt="Sync-Space logo" />
          <div>
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a reset token.</p>
          </div>
        </div>

        {error && <p className="forgot-password-alert forgot-password-alert-error">{error}</p>}
        {message && <p className="forgot-password-alert forgot-password-alert-success">{message}</p>}

        <form className="forgot-password-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="forgot-password-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="forgot-password-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
