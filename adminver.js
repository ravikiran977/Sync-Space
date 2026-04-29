import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import TaskBoard from "../components/TaskBoard";
import DashboardMessage from "../components/DashboardMessage";
import Modal from "../components/Modal";
import CreateTask from "../components/CreateTask";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [activeColumn, setActiveColumn] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTask = async (newTask) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => [...prev, response.data]);
      setMessage(`Created "${response.data.title}" successfully`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Unable to create task. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    const taskToDelete = tasks.find((t) => t._id === taskId);
    await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    setMessage(`Task "${taskToDelete?.title || "task"}" deleted`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdateTask = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
      setMessage("Task status updated");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const counts = tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {
      total: 0,
      todo: 0,
      "in-progress": 0,
      review: 0,
      completed: 0,
    }
  );

  return (
    <div className="dashboard-container">
      <Navbar />

      <header className="dashboard-header">
        <div>
          <p className="dashboard-label">Admin overview</p>
          <h1>Task Management Center</h1>
          <p className="dashboard-subtitle">
            Monitor progress, assign work, and keep your team moving forward from one central view.
          </p>
        </div>

        <div className="dashboard-actions">
          <button className="primary-btn" onClick={() => setIsCreateModalOpen(true)}>
            + New task
          </button>
        </div>
      </header>

      <section className="dashboard-summary">
        <div className="summary-card summary-total">
          <span className="card-label">Total Tasks</span>
          <strong>{counts.total}</strong>
        </div>
        <div className="summary-card summary-todo">
          <span className="card-label">To Do</span>
          <strong>{counts.todo}</strong>
        </div>
        <div className="summary-card summary-progress">
          <span className="card-label">In Progress</span>
          <strong>{counts["in-progress"]}</strong>
        </div>
        <div className="summary-card summary-review">
          <span className="card-label">Review</span>
          <strong>{counts.review}</strong>
        </div>
        <div className="summary-card summary-completed">
          <span className="card-label">Completed</span>
          <strong>{counts.completed}</strong>
        </div>
      </section>

      <section className="board-panel">
        <div className="board-panel-header">
          <div>
            <h2>Task board</h2>
            <p>Drag tasks between columns or update status directly from each card.</p>
          </div>
        </div>

        <div className="board">
          <TaskBoard
            tasks={tasks}
            onCreate={handleCreateTask}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
            activeColumn={activeColumn}
            setActiveColumn={setActiveColumn}
          />
        </div>
      </section>

      <DashboardMessage message={message} />

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <CreateTask
          onCreate={(task) => {
            handleCreateTask(task);
            setIsCreateModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default AdminDashboard;
