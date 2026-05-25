//Navbar.js

import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../Logo.png";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let role = "";

  try {
    role = token ? jwtDecode(token).role : "";
  } catch {
    role = "";
  }

  const handleDashboard = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);

      if (decoded.role === "admin") {
        navigate("/AdminDashboard");
      } else {
        navigate("/UserDashboard");
      }
    } catch (error) {
      console.error("Invalid token");

      localStorage.removeItem("token");

      navigate("/login");
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav>
      <div className="nav-brand">
        <img src={logo} alt="Sync-Space logo" />
        <span>Sync-Space</span>
      </div>
      <div className="nav-actions">
        <button className="nav-button nav-button-light" onClick={handleDashboard}>
          Dashboard
        </button>
        {role === "admin" && (
          <button className="nav-button nav-button-light" onClick={() => navigate("/CreateProject")}>
            Projects
          </button>
        )}
        <button className="nav-button nav-button-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
