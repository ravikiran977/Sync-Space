//AdminDashboard.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import TaskBoard from "../components/TaskBoard";
import DashboardMessage from "../components/DashboardMessage";
import "../styles/AdminDashboard.css"

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [activeColumn, setActiveColumn] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ CREATE TASK HANDLER
  const handleCreateTask = async (newTask) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        newTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add new task instantly to UI
      setTasks((prev) => [...prev, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    const taskToDelete = tasks.find((t) => t._id === taskId);

    await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    setMessage(`Task ${taskToDelete.title} deleted`);
  };

  const handleUpdateTask = async (taskId, newStatus) => {
    
    try{
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

        // refetch to get updated tasklist
    
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, status: newStatus } : t
      )
    );
  } catch(error){ 
  console.error("Error updating task:", error);
}
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <h2>Admin Dashboard</h2>

      <div className="board">
        {/* ✅ TASK BOARD */}
        <TaskBoard
          tasks={tasks}
          onCreate ={handleCreateTask}
          onDelete={handleDeleteTask}
          onUpdate={handleUpdateTask}
          activeColumn ={activeColumn}
          setActiveColumn={setActiveColumn}
        />
      </div>

      <DashboardMessage message={message} />
    </div>
  );
}

export default AdminDashboard;