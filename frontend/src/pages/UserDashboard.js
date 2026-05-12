// src/pages/UserDashboard.js

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import ViewTask from "../components/ViewTask";
import "../styles/UserDashboard.css";

const BASE_URL = "http://localhost:5000/api/tasks";

// ─── Status config: label + emoji for each column ───────────────────────────
const STATUSES = [
  { key: "todo",        label: "To Do",       emoji: "📋" },
  { key: "in-progress", label: "In Progress", emoji: "⚡" },
  { key: "review",      label: "Review",      emoji: "🔍" },
  { key: "completed",   label: "Completed",   emoji: "✅" },
];

// ─── Priority badge class map ────────────────────────────────────────────────
const PRIORITY_BADGE_CLASSES = {
  low: "ud-priority-badge--low",
  medium: "ud-priority-badge--medium",
  high: "ud-priority-badge--high",
};

// ─── Helper: decode user name from JWT ──────────────────────────────────────
function getUserName() {
  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    // JWT stores id and role — name isn't always there,
    // so we fall back to "User" gracefully
    return decoded.name || "User";
  } catch {
    return "User";
  }
}

// ─── Small reusable stat card ────────────────────────────────────────────────
function StatCard({ label, count, emoji }) {
  return (
    <div className="ud-stat-card">
      <span className="ud-stat-emoji">{emoji}</span>
      <strong className="ud-stat-count">{count}</strong>
      <span className="ud-stat-label">{label}</span>
    </div>
  );
}

// ─── Individual task card (draggable) ────────────────────────────────────────
function TaskCard({ task, onStatusChange, onViewTask }) {
  const priority = task.priority || "medium";
  const priorityClass = PRIORITY_BADGE_CLASSES[priority] || PRIORITY_BADGE_CLASSES.medium;

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task._id);
  };

  const isCompleted = task.status === "completed";

  return (
    <div
      className={`ud-task-card ${isCompleted ? "ud-task-card--done" : ""}`}
      draggable
      role="button"
      tabIndex={0}
      onDragStart={handleDragStart}
      onClick={() => onViewTask(task._id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onViewTask(task._id);
        }
      }}
    >
      {/* Priority badge */}
      <span
        className={`ud-priority-badge ${priorityClass}`}
      >
        {priority.toUpperCase()}
      </span>

      <h4 className="ud-task-title">{task.title}</h4>
      <p  className="ud-task-desc">{task.description}</p>

      <div className="ud-task-meta">
        {task.dueDate && (
          <span className="ud-task-due">
            📅 {new Date(task.dueDate).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>
        )}
      </div>

      {/* Status dropdown — disabled when completed */}
      <select
        className="ud-status-select"
        value={task.status}
        disabled={isCompleted}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          e.stopPropagation();
          onStatusChange(task._id, e.target.value);
        }}
      >
        {STATUSES.map((s) => (
          <option key={s.key} value={s.key}>
            {s.label}
          </option>
        ))}
      </select>

      {isCompleted && (
        <p className="ud-done-label">🎉 Task completed!</p>
      )}
    </div>
  );
}

// ─── Kanban column (droppable) ────────────────────────────────────────────────
function KanbanColumn({ statusConfig, tasks, onStatusChange, onViewTask, activeCol, setActiveCol }) {
  const { key, label, emoji } = statusConfig;
  const isDragOver = activeCol === key;

  const handleDragOver = (e) => {
    e.preventDefault();
    setActiveCol(key);
  };

  const handleDragLeave = () => {
    setActiveCol(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setActiveCol(null);
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) onStatusChange(taskId, key);
  };

  return (
    <div
      className={`ud-column ${isDragOver ? "ud-column--drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="ud-column-header">
        <span className="ud-column-emoji">{emoji}</span>
        <h3 className="ud-column-title">{label}</h3>
        <span className="ud-column-count">{tasks.length}</span>
      </div>

      {/* Task list */}
      <div className="ud-column-body">
        {tasks.length === 0 ? (
          <p className="ud-column-empty">No-Tasks Here Yet</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={onStatusChange}
              onViewTask={onViewTask}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main UserDashboard ───────────────────────────────────────────────────────
function UserDashboard() {
  const [tasks,     setTasks]     = useState([]);
  const [stats,     setStats]     = useState({ totalTasks: 0, todo: 0, inProgress: 0, review: 0, completed: 0 });
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [activeCol, setActiveCol] = useState(null);
  const [message,   setMessage]   = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const token    = localStorage.getItem("token");
  const userName = getUserName();

  // ── Fetch user's assigned tasks ──────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Could not load your tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Fetch stats summary ──────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/my-dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // ── Update task status (local + API) ────────────────────────────────────
  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update — feels instant
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await axios.put(
        `${BASE_URL}/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh stats after status change
      fetchStats();

      const task = tasks.find((t) => t._id === taskId);
      if (newStatus === "completed") {
        setMessage(`✅ "${task?.title}" marked as completed!`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error updating task:", err);
      // Revert on failure
      fetchTasks();
      setError("Failed to update task status.");
      setTimeout(() => setError(""), 3000);
      throw err;
    }
  };

  // ── Filter tasks by status ───────────────────────────────────────────────
  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

  // ── Greeting based on time of day ────────────────────────────────────────
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="ud-page">
      <Navbar />

      <div className="ud-container">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="ud-header">
          <div>
            <p className="ud-greeting-label">
              {getGreeting()}, {userName} 👋
            </p>
            <h1 className="ud-heading">My Task Board</h1>
            <p className="ud-subheading">
              Track and update your assigned tasks below.
            </p>
          </div>
        </div>

        {/* ── Toast messages ──────────────────────────────────────────── */}
        {message && <div className="ud-toast ud-toast--success">{message}</div>}
        {error   && <div className="ud-toast ud-toast--error">{error}</div>}

        {/* ── Stats summary cards ──────────────────────────────────────── */}
        <div className="ud-stats-row">
          <StatCard label="Total Tasks"  count={stats.totalTasks} emoji="📊" />
          <StatCard label="To Do"        count={stats.todo}        emoji="📋" />
          <StatCard label="In Progress"  count={stats.inProgress}  emoji="⚡" />
          <StatCard label="In Review"    count={stats.review}      emoji="🔍" />
          <StatCard label="Completed"    count={stats.completed}   emoji="✅" />
        </div>

        {/* ── Kanban board ─────────────────────────────────────────────── */}
        {loading ? (
          <div className="ud-loading">Loading your tasks…</div>
        ) : (
          <div className="ud-board">
            {STATUSES.map((statusConfig) => (
              <KanbanColumn
                key={statusConfig.key}
                statusConfig={statusConfig}
                tasks={tasksByStatus(statusConfig.key)}
                onStatusChange={handleStatusChange}
                onViewTask={setSelectedTaskId}
                activeCol={activeCol}
                setActiveCol={setActiveCol}
              />
            ))}
          </div>
        )}

      </div>
      {selectedTaskId && (
        <ViewTask
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default UserDashboard;
