import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../Logo.png";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const dashboardPath = role === "admin" ? "/AdminDashboard" : "/UserDashboard";
  const navItems = [
    { label: "Dashboard", path: dashboardPath, onClick: handleDashboard },
    ...(role === "admin"
      ? [{ label: "Projects", path: "/CreateProject", onClick: () => navigate("/CreateProject") }]
      : []),
    ...(token ? [{ label: "Profile", path: "/profile", onClick: () => navigate("/profile") }] : []),
  ];

  return (
    <aside className="sidebar-nav" aria-label="Primary navigation">
      <div className="nav-brand">
        <img src={logo} alt="Sync-Space logo" />
        <span>Sync-Space</span>
      </div>
      <div className="nav-actions">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              className={`nav-button nav-button-light ${isActive ? "nav-button-active" : ""}`}
              onClick={item.onClick}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </button>
          );
        })}
        {token && (
          <button className="nav-button nav-button-danger" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </aside>
  );
}

export default Navbar;
