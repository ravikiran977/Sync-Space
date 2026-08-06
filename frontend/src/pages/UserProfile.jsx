import React, { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/UserProfile.css";

const formatDate = (value) => {
  if (!value) return "Not available";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "U";

  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

function UserProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const decodedUser = useMemo(() => {
    try {
      return token ? jwtDecode(token) : null;
    } catch {
      return null;
    }
  }, [token]);

  const userId = decodedUser?.id;

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setFormData({
          name: response.data?.name || "",
          email: response.data?.email || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        setError(error.response?.data?.message || "Could not load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token, userId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put(
        `/users/${userId}`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data.user);
      setFormData({
        name: response.data.user?.name || "",
        email: response.data.user?.email || "",
      });
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setError("");
    setMessage("");
  };

  const projects = user?.projects || [];
  const isDirty = user && (formData.name !== user.name || formData.email !== user.email);

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">
        <header className="profile-header">
          <div className="profile-identity">
            <div className="profile-avatar" aria-hidden="true">
              {getInitials(user?.name)}
            </div>
            <div>
              <p className="profile-label">Account profile</p>
              <h1>{user?.name || "Your Profile"}</h1>
              <p className="profile-subtitle">{user?.email || "Keep your account details current."}</p>
            </div>
          </div>
        </header>

        {error && <div className="profile-alert profile-alert--error">{error}</div>}
        {message && <div className="profile-alert profile-alert--success">{message}</div>}

        {loading ? (
          <div className="profile-loading">Loading profile...</div>
        ) : (
          <div className="profile-grid">
            <section className="profile-panel profile-panel--summary">
              <div className="profile-summary-top">
                <div className="profile-avatar profile-avatar--large" aria-hidden="true">
                  {getInitials(user?.name)}
                </div>
                <div>
                  <h2>{user?.name}</h2>
                  <span className="profile-role">{user?.role || "user"}</span>
                </div>
              </div>

              <dl className="profile-detail-list">
                <div>
                  <dt>Email</dt>
                  <dd>{user?.email}</dd>
                </div>
                <div>
                  <dt>Member since</dt>
                  <dd>{formatDate(user?.createdAt)}</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>{formatDate(user?.updatedAt)}</dd>
                </div>
                <div>
                  <dt>Assigned projects</dt>
                  <dd>{projects.length}</dd>
                </div>
              </dl>
            </section>

            <section className="profile-panel">
              <div className="profile-panel-header">
                <h2>Edit Details</h2>
              </div>

              <form className="profile-form" onSubmit={handleSubmit}>
                <label>
                  Name
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </label>

                <div className="profile-form-actions">
                  <button className="secondary-action-btn" type="button" onClick={handleReset} disabled={!isDirty || saving}>
                    Cancel
                  </button>
                  <button className="primary-btn" type="submit" disabled={!isDirty || saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>

            <section className="profile-panel profile-panel--projects">
              <div className="profile-panel-header">
                <h2>Projects</h2>
              </div>

              {projects.length === 0 ? (
                <div className="profile-empty">No projects assigned yet.</div>
              ) : (
                <ul className="profile-project-list">
                  {projects.map((project) => (
                    <li key={project._id || project}>
                      <strong>{project.name || "Untitled project"}</strong>
                      {project.description && <span>{project.description}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserProfile;
