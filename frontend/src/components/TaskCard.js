// TaskCard.js

import React from "react";
import "../styles/taskcard.css";

function TaskCard({ task, onDelete, onUpdate }) {
  const handleChange = (e) => {
    const newStatus = e.target.value;
    onUpdate(task._id, newStatus);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task._id);
  };

  const priority = task.priority || "medium";
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";
  
  return (
    <div
      className={`task-card ${task.status === "completed" ? "task-card-completed" : ""}`}
      draggable={task.status !== "completed"}
      onDragStart={handleDragStart}
    >
      <div className="task-card-topline">
        <span className={`task-priority task-priority-${priority}`}>
          {priority}
        </span>
        <span className="task-date">{dueDate}</span>
      </div>

      <h4 className="task-title">{task.title}</h4>
      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <span>Assigned</span>
        <strong>{task.assignedTo?.name || "Unassigned"}</strong>
      </div>

      <select
        className="task-status-select"
        value={task.status}
        onChange={handleChange}
        disabled={task.status === "completed"}
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In-Progress</option>
        <option value="review">Review</option>
        <option value="completed">Completed</option>
      </select>

      <button 
        className="task-btn delete-btn"
        onClick={() => onDelete(task._id)}
      >
        Delete
      </button>
    </div>
  );
}

export default TaskCard;
