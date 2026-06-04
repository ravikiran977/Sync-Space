import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/CreateProject.css";

function CreateProject() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");
      const response = await api.post(
        "/projects",
        {
          name,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem("selectedProjectId", response.data._id);
      setMessage(`Project "${response.data.name}" created.`);
      setName("");
      setDescription("");

      setTimeout(() => navigate("/AdminDashboard"), 700);
    } catch (error) {
      setError(error.response?.data?.message || "Could not create this project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-project-page">
      <Navbar />

      <main className="create-project-shell">
        <section className="create-project-card">
          <div className="create-project-heading">
            <p>Project setup</p>
            <h1>Create Project</h1>
            <span>Tasks, assignments, and board views will live inside this project.</span>
          </div>

          {message && <div className="create-project-alert success">{message}</div>}
          {error && <div className="create-project-alert error">{error}</div>}

          <form className="create-project-form" onSubmit={handleSubmit}>
            <label>
              Project Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Website redesign"
              />
            </label>

            <label>
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What this project is responsible for"
              />
            </label>

            <div className="create-project-actions">
              <button type="button" className="secondary-btn" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="primary-btn" disabled={saving}>
                {saving ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CreateProject;
