import { useNavigate } from "react-router-dom";
import logo from "../Logo.png";
import "../styles/Landing.css";

const workspaceStats = [
  { value: "4", label: "Task stages" },
  { value: "2", label: "Focused dashboards" },
  { value: "1", label: "Shared workspace" },
];

const highlights = [
  {
    eyebrow: "For admins",
    title: "Turn priorities into owned work",
    text: "Create tasks with owners, due dates, and statuses so everyone knows what should happen next.",
  },
  {
    eyebrow: "For teams",
    title: "See progress without chasing updates",
    text: "Track work from todo to completion in a shared view that keeps blockers and handoffs visible.",
  },
  {
    eyebrow: "For focus",
    title: "Keep each role on the right dashboard",
    text: "Admins manage the flow while teammates get a simple place to review and complete assigned work.",
  },
];

function Landing() {
  const navigate = useNavigate();

  const scrollToWorkspaceSnapshot = () => {
    document.getElementById("workspace-snapshot")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleGitHubClick = () => {
    window.open("https://github.com/ravikiran977/Sync-Space", "_blank");
  };

  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Primary">
        <div className="landing-brand">
          <img src={logo} alt="Sync-Space logo" />
          <span>Sync-Space</span>
        </div>

        <div className="landing-nav-actions">
          <button className="landing-register-btn" onClick={handleRegisterClick}>
            Register
          </button>
          <button className="landing-register-btn" onClick={handleGitHubClick}>
            GitHub README
          </button>
          <button className="landing-login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-kicker">Team. Projects. Together.</p>
          <h1>Sync-Space</h1>
          <p className="landing-subtitle">
            Plan team work, assign clear ownership, and keep progress visible from the first task to
            the final review.
          </p>

          <div className="landing-actions">
            <button className="landing-primary-btn" onClick={scrollToWorkspaceSnapshot}>
              Open Workspace
            </button>
            <button className="landing-secondary-btn" onClick={() => navigate("/login")}>
              I already have an account
            </button>
          </div>

          <div className="landing-trust-row" aria-label="Workspace summary">
            {workspaceStats.map((stat) => (
              <div className="landing-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-intent-panel" aria-label="Sync-Space workflow">
          <div className="landing-intent-header">
            <img src={logo} alt="Sync-Space logo" />
            <div>
              <span>How Sync-Space works</span>
              <strong>One flow for the whole team</strong>
            </div>
          </div>

          <ol className="landing-flow-list">
            <li>
              <span>01</span>
              <strong>Plan the work</strong>
            </li>
            <li>
              <span>02</span>
              <strong>Assign owners</strong>
            </li>
            <li>
              <span>03</span>
              <strong>Review progress</strong>
            </li>
          </ol>
        </div>
      </section>

      <section className="landing-snapshot" id="workspace-snapshot" aria-label="Workspace snapshot">
        <div className="landing-snapshot-copy">
          <span>Workspace snapshot</span>
          <h2>Dashboard previews will live here.</h2>
          <p>
            This section is reserved for polished snapshots of the admin dashboard, user dashboard,
            and task views after those pages are finished.
          </p>
        </div>
        <div className="landing-snapshot-placeholder" aria-hidden="true">
          <div />
          <div />
          <div />
        </div>
      </section>

      <section className="landing-highlights" aria-label="Workspace highlights">
        {highlights.map((highlight) => (
          <article key={highlight.title}>
            <span>{highlight.eyebrow}</span>
            <strong>{highlight.title}</strong>
            <p>{highlight.text}</p>
          </article>
        ))}
      </section>

      <section className="landing-final-cta" aria-label="Get started">
        <div>
          <span>Ready when your team is</span>
          <h2>Start with a clean workspace and a shared view of progress.</h2>
        </div>
        <button className="landing-primary-btn" onClick={handleRegisterClick}>
          Create Account
        </button>
        <button className="landing-secondary-btn" onClick={handleGitHubClick}>
          View Demo Credentials
        </button>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-brand">
          <img src={logo} alt="Sync-Space logo" />
          <div>
            <strong>Sync-Space</strong>
            <p>Simple task flow for focused teams.</p>
          </div>
        </div>

        <div className="landing-footer-links" aria-label="Footer navigation">
          <button type="button" onClick={scrollToWorkspaceSnapshot}>
            Workspace
          </button>
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>
          <button type="button" onClick={handleRegisterClick}>
            Register
          </button>
          <button type="button" onClick={handleGitHubClick}>
            GitHub README
          </button>
        </div>

        <p className="landing-footer-note">
          Built for clear ownership, visible progress, and calmer teamwork.
        </p>
      </footer>
    </main>
  );
}

export default Landing;
