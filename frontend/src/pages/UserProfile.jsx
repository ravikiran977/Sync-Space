import React, { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

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
          phone: response.data?.phone || "",
          department: response.data?.department || "",
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

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  const handleAccountSubmit = async (event) => {
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
        phone: response.data.user?.phone || "",
        department: response.data.user?.department || "",
      });
      setMessage("Account information updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Could not update your account.");
    } finally {
      setSaving(false);
    }
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await api.put(
        `/users/${userId}`,
        {
          phone: formData.phone.trim() || null,
          department: formData.department.trim() || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(response.data.user);
      setFormData({
        name: response.data.user?.name || "",
        email: response.data.user?.email || "",
        phone: response.data.user?.phone || "",
        department: response.data.user?.department || "",
      });
      setMessage("Contact information updated successfully.");
    } catch (error) {
      console.error("Error updating contact:", error);
      setError(error.response?.data?.message || "Could not update contact information.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("All password fields are required.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      setChangingPassword(true);
      setError("");
      setMessage("");

      await api.post(
        `/users/${userId}/change-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully.");
    } catch (error) {
      console.error("Error changing password:", error);
      setError(error.response?.data?.message || "Could not change your password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      department: user?.department || "",
    });
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setError("");
    setMessage("");
    setIsEditMode(false);
  };

  const projects = user?.projects || [];
  const isAccountDirty =
    user &&
    (formData.name !== user.name || formData.email !== user.email);
  const isContactDirty =
    user &&
    (formData.phone !== (user.phone || "") ||
      formData.department !== (user.department || ""));

  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar />
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Sidebar />

      <main className="profile-container">
        {error && <div className="alert alert--error">{error}</div>}
        {message && <div className="alert alert--success">{message}</div>}

        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-header-content">
            <div className="profile-avatar-large">{getInitials(user?.name)}</div>
            <div className="profile-header-info">
              <h1 className="profile-name">{user?.name}</h1>
              <p className="profile-role-badge">{user?.role || "user"}</p>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{projects.length}</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{formatDate(user?.createdAt)}</span>
                  <span className="stat-label">Member Since</span>
                </div>
              </div>
            </div>
          </div>
          <button
            className={`edit-btn ${isEditMode ? "edit-btn--active" : ""}`}
            onClick={() => {
              setIsEditMode(!isEditMode);
              setError("");
              setMessage("");
            }}
          >
            {isEditMode ? "✕ Cancel" : "✎ Edit"}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="profile-content-grid">
          {/* Account Settings Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Account Settings</h2>
              {isAccountDirty && <span className="unsaved-indicator">●</span>}
            </div>
            {isEditMode ? (
              <form className="profile-form" onSubmit={handleAccountSubmit}>
                <div className="form-group">
                  <label>
                    <span className="label-text">Full Name</span>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="Enter your full name"
                    />
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-text">Email Address</span>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="Enter your email"
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={handleReset}
                    disabled={saving}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={!isAccountDirty || saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-display">
                <div className="info-row">
                  <span className="info-label">Name</span>
                  <span className="info-value">{user?.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user?.email}</span>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Contact Information</h2>
              {isContactDirty && <span className="unsaved-indicator">●</span>}
            </div>
            {isEditMode ? (
              <form className="profile-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label>
                    <span className="label-text">Phone Number</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                      placeholder="+1 (555) 000-0000"
                    />
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-text">Department</span>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g., Engineering"
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={handleReset}
                    disabled={saving}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={!isContactDirty || saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-display">
                <div className="info-row">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{user?.phone || "Not provided"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Department</span>
                  <span className="info-value">{user?.department || "Not provided"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Password Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Password & Security</h2>
            </div>
            {isEditMode ? (
              <form className="profile-form" onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label>
                    <span className="label-text">Current Password</span>
                    <input
                      type="password"
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      autoComplete="current-password"
                      placeholder="Enter current password"
                    />
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-text">New Password</span>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      placeholder="Enter new password"
                    />
                  </label>
                </div>

                <div className="form-group">
                  <label>
                    <span className="label-text">Confirm Password</span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => {
                      setPasswordData({
                        oldPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setError("");
                    }}
                    disabled={changingPassword}
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={
                      !passwordData.newPassword || changingPassword
                    }
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="info-display">
                <div className="security-info">
                  <span className="security-icon">🔒</span>
                  <div>
                    <p className="security-title">Password Last Changed</p>
                    <p className="security-date">{formatDate(user?.updatedAt)}</p>
                  </div>
                </div>
                <p className="security-hint">Click Edit to change your password</p>
              </div>
            )}
          </div>

          {/* Projects Card */}
          <div className="profile-card">
            <div className="card-header">
              <h2>Your Projects</h2>
              <span className="card-badge">{projects.length}</span>
            </div>
            {projects.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📁</span>
                <p>No projects assigned yet</p>
              </div>
            ) : (
              <ul className="projects-list">
                {projects.map((project) => (
                  <li key={project._id || project} className="project-item">
                    <div className="project-info">
                      <h3>{project.name || "Untitled project"}</h3>
                      {project.description && (
                        <p className="project-description">{project.description}</p>
                      )}
                    </div>
                    <span className="project-arrow">→</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserProfile;
