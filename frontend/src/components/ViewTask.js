import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ViewTask.css";

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  completed: "Completed",
};

const priorityLabels = {
  low: "Low Priority",
  medium: "Medium Priority",
  high: "High Priority",
};

const statuses = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
];

const formatDate = (date) => {
  if (!date) return "No due date";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ViewTask = ({ taskId: popupTaskId, onClose, onStatusChange }) => {
  const { taskId: routeTaskId } = useParams();
  const navigate = useNavigate();
  const taskId = popupTaskId || routeTaskId;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [draftStatus, setDraftStatus] = useState("");

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }

    navigate(-1);
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError("");
        setActionError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view this task.");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTask(response.data);
        setDraftStatus(response.data.status || "todo");
      } catch (error) {
        console.error("Error fetching task:", error);
        setError(error.response?.data?.message || "Failed to load task.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleStatusSelect = (event) => {
    setDraftStatus(event.target.value);
    setActionError("");
  };

  const handleSaveChanges = async () => {
    const previousStatus = task.status || "todo";

    if (draftStatus === previousStatus) return;

    setSavingStatus(true);
    setActionError("");

    try {
      if (onStatusChange) {
        await onStatusChange(taskId, draftStatus);
      } else {
        const token = localStorage.getItem("token");

        await axios.put(
          `http://localhost:5000/api/tasks/${taskId}`,
          { status: draftStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setTask((prevTask) => ({ ...prevTask, status: draftStatus }));
      setActionError("");
    } catch (error) {
      console.error("Error updating task status:", error);
      setDraftStatus(previousStatus);
      setActionError(
        error.response?.data?.message || "Could not update this task."
      );
    } finally {
      setSavingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="view-task-page">
        <div className="view-task-state">Loading Task...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-task-page">
        <div className="view-task-state view-task-state-error">{error}</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="view-task-page">
        <div className="view-task-state">Task not found.</div>
      </div>
    );
  }

  const assignedName = task.assignedTo?.name || "Unassigned";
  const createdName = task.createdBy?.name || "Unknown";
  const priority = task.priority || "medium";
  const savedStatus = task.status || "todo";
  const status = draftStatus || savedStatus;
  const hasStatusChanges = status !== savedStatus;

  return (
    <div className="view-task-page" onClick={handleClose}>
      <main
        className="view-task-shell"
        aria-label="Task detail"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="view-task-main">
          <button
            className="view-task-close view-task-close-mobile"
            type="button"
            onClick={handleClose}
            aria-label="Close task detail"
          >
            x
          </button>
          
          <header className="view-task-header">
            <h1 className="view-task-title">{task.title}</h1>
            <div className="view-task-badges" aria-label="Task labels">
              <span className="view-task-badge badge-status">
                {statusLabels[status] || status}
              </span>
              <span className={`view-task-badge badge-priority-${priority}`}>
                {priorityLabels[priority] || priority}
              </span>
            </div>
          </header>

          <section className="view-task-section">
            <div className="view-task-section-heading">
              <h2>Description</h2>
            </div>
            <p className="view-task-description">
              {task.description || "No description provided."}
            </p>
          </section>

          <section className="view-task-section">
            <div className="view-task-section-heading">
              <h2>Activity</h2>
            </div>

            <div className="view-task-activity">
              <span className="view-task-activity-marker" />
              <div className="view-task-activity-body">
                <div className="view-task-activity-meta">
                  <strong>{createdName}</strong>
                  <span>{formatDate(task.createdAt)}</span>
                </div>
                <p>Created this task and assigned it to {assignedName}.</p>
              </div>
            </div>

            <div className="view-task-activity">
              <span className="view-task-activity-marker" />
              <div className="view-task-activity-body">
                <div className="view-task-activity-meta">
                  <strong>{assignedName}</strong>
                  <span>{statusLabels[status] || status}</span>
                </div>
                <p>Current task status is {statusLabels[status] || status}.</p>
              </div>
            </div>
          </section>
        </section>

        <aside className="view-task-side">
          <button
            className="view-task-close"
            type="button"
            onClick={handleClose}
            aria-label="Close task detail"
          >
            x
          </button>

          <div className="view-task-side-group">
            <span className="view-task-side-label">Status</span>
            <label className="view-task-status-field">
              <span className={`view-task-status-dot status-${status}`} />
              <select
                value={status}
                onChange={handleStatusSelect}
                disabled={savingStatus}
              >
                {statuses.map((statusOption) => (
                  <option key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="view-task-side-group">
            <span className="view-task-side-label">Assigned To</span>
            <div className="view-task-person">
              <span className="view-task-person-marker" />
              <div>
                <strong>{assignedName}</strong>
                <span>{task.assignedTo?.email || "Team member"}</span>
              </div>
            </div>
          </div>

          <div className="view-task-side-group">
            <span className="view-task-side-label">Due Date</span>
            <div className="view-task-pill">{formatDate(task.dueDate)}</div>
          </div>

          <div className="view-task-side-group">
            <span className="view-task-side-label">Created By</span>
            <div className="view-task-person">
              <span className="view-task-person-marker view-task-person-marker-green" />
              <div>
                <strong>{createdName}</strong>
                <span>{task.createdBy?.email || "Task owner"}</span>
              </div>
            </div>
          </div>

          <div className="view-task-actions">
            <button
              className="view-task-save-btn"
              type="button"
              onClick={handleSaveChanges}
              disabled={!hasStatusChanges || savingStatus}
            >
              {savingStatus ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="view-task-secondary-btn"
              type="button"
              onClick={handleClose}
            >
              Close
            </button>
            {actionError && (
              <p className="view-task-action-error">{actionError}</p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default ViewTask;
