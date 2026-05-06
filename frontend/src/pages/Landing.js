import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../Logo.png";
import "../styles/Landing.css";

function Landing() {
  const navigate = useNavigate();

  const handleEnterApp = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      navigate(decoded.role === "admin" ? "/AdminDashboard" : "/UserDashboard");
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Primary">
        <div className="landing-brand">
          <img src={logo} alt="Sync-Space logo" />
          <span>Sync-Space</span>
        </div>

        <div className="landing-nav-actions">
          <button className="landing-register-btn" onClick={() => navigate("/register")}>
            Register
          </button>
          <button className="landing-login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-kicker">Teams. Projects. Together.</p>
          <h1>Sync-Space</h1>
          <p className="landing-subtitle">
            A focused workspace for assigning tasks, tracking progress, and keeping team priorities visible from one dashboard.
          </p>

          <div className="landing-actions">
            <button className="landing-primary-btn" onClick={handleEnterApp}>
              Open Workspace
            </button>
            <button className="landing-secondary-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="landing-secondary-btn" onClick={() => navigate("/register")}>
              Create Account
            </button>
          </div>
        </div>

        <div className="landing-logo-panel">
          <img src={logo} alt="Sync-Space" />
        </div>
      </section>

      <section className="landing-highlights" aria-label="Workspace highlights">
        <article>
          <span>01</span>
          <strong>Assign</strong>
          <p>Create work items with owners, due dates, and priorities.</p>
        </article>
        <article>
          <span>02</span>
          <strong>Track</strong>
          <p>Move tasks through todo, progress, review, and completion.</p>
        </article>
        <article>
          <span>03</span>
          <strong>Review</strong>
          <p>Use admin and user dashboards to keep everyone aligned.</p>
        </article>
      </section>
    </main>
  );
}

export default Landing;
