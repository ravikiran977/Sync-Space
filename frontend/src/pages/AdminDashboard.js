//AdminDashboard.js

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskBoard from "../components/TaskBoard";
import DashboardMessage from "../components/DashboardMessage";
import ViewTask from "../components/ViewTask";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [message, setMessage] = useState("");
  const [activeColumn, setActiveColumn] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const projectList = response.data || [];
      setProjects(projectList);

      const savedProjectId = localStorage.getItem("selectedProjectId");
      const savedProject = projectList.find((project) => project._id === savedProjectId);
      const nextProjectId = savedProject?._id || projectList[0]?._id || "";

      setSelectedProjectId(nextProjectId);

      if (nextProjectId) {
        localStorage.setItem("selectedProjectId", nextProjectId);
      }
    } catch (error) {
      console.error(error);
      setError("Could not load projects.");
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchTasks = useCallback(async () => {
    if (!selectedProjectId) {
      setTasks([]);
      return;
    }

    try {
      setLoadingTasks(true);
      setError("");
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params: { projectId: selectedProjectId },
      });

      setTasks(response.data);
    } catch (error) {
      console.error(error);
      setError("Could not load project tasks.");
    } finally {
      setLoadingTasks(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (newTask) => {
    if (!selectedProjectId) {
      setMessage("Create a project before adding tasks.");
      throw new Error("Project is required");
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        { ...newTask, projectId: selectedProjectId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks((prev) => [...prev, response.data]);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Could not create task.");
      throw error;
    }
  };

  const handleProjectChange = (event) => {
    const nextProjectId = event.target.value;
    setSelectedProjectId(nextProjectId);
    localStorage.setItem("selectedProjectId", nextProjectId);
    setMessage("");
    setSelectedTaskId(null);
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    const taskToDelete = tasks.find((t) => t._id === taskId);

    await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    setMessage(`Task ${taskToDelete?.title || ""} deleted`);
  };

  const handleUpdateTask = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // refetch to get updated tasklist

      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const selectedProject = projects.find((project) => project._id === selectedProjectId);

  return (
    <div className="dashboard-container">
      <Navbar />

      <header className="dashboard-header">
        <div>
          <p className="dashboard-label">Admin workspace</p>
          <h1>{selectedProject?.name || "Project Dashboard"}</h1>
          <p className="dashboard-subtitle">
            Create projects first, then keep each task board scoped to the active project.
          </p>
        </div>

        <div className="dashboard-actions">
          <label className="project-switcher">
            Project
            <select
              value={selectedProjectId}
              onChange={handleProjectChange}
              disabled={loadingProjects || projects.length === 0}
            >
              {projects.length === 0 ? (
                <option value="">No projects yet</option>
              ) : (
                projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))
              )}
            </select>
          </label>

          <button className="primary-btn" type="button" onClick={() => navigate("/CreateProject")}>
            New Project
          </button>
        </div>
      </header>

      {error && <div className="dashboard-error">{error}</div>}

      {!loadingProjects && projects.length === 0 ? (
        <section className="empty-project-state">
          <h2>No Projects Yet</h2>
          <p>Create your first project to unlock the task board, assignment flow, and statuses.</p>
          <button className="primary-btn" type="button" onClick={() => navigate("/CreateProject")}>
            Create Project
          </button>
        </section>
      ) : (
        <div className="board">
          {loadingTasks ? (
            <div className="dashboard-loading">Loading project tasks...</div>
          ) : (
            <TaskBoard
              tasks={tasks}
              onCreate={handleCreateTask}
              onDelete={handleDeleteTask}
              onUpdate={handleUpdateTask}
              onViewTask={setSelectedTaskId}
              activeColumn={activeColumn}
              setActiveColumn={setActiveColumn}
              projectId={selectedProjectId}
            />
          )}
        </div>
      )}

      <DashboardMessage message={message} />
      {selectedTaskId && (
        <ViewTask
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onStatusChange={handleUpdateTask}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
