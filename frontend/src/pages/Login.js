import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../Logo.png";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();

      if(!email || !password) {           // check if fields are empty
        setError("Please fill all fields");
        return;
      }

      if(!email.includes("@")) {            // basic email validation
        setError("Please enter a valid email");
        console.log("Invalid email format");
        return;
      }

    try {

      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );

      const token = res.data.token;

      // store token
      localStorage.setItem("token", token);

      // decode token
      const decoded = jwtDecode(token);

      console.log(decoded); // 🔍 check this

      if (decoded.role === "admin") {
        navigate("/AdminDashboard");
      } else {
        navigate("/UserDashboard");
      }

    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src={logo} alt="Sync-Space logo" />
          <div>
            <h2>Sync-Space</h2>
            <p className="login-subtitle">Login to your workspace</p>
          </div>
        </div>
        {error && <p className="login-error">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email" className="email-label">Email</label>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="password-label">Password</label>
          <div className="password-field">
            <input
              id="password"
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="login-extra-links">
            <button type="button" onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </button>
          </div>
        </form>
        <p className="login-footer">
          New to Sync-Space?
          <button type="button" onClick={() => navigate("/register")}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
