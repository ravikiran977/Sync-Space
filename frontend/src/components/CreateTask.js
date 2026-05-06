//createTAsk.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/CreateTask.css";

function CreateTask({ onCreate, defaultStatus, hideStatus, compact=false }) {
  const [showForm, setShowForm] = useState(!compact); // ✅ toggle form
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(defaultStatus ||"todo");
  const [message, setMessage] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser || !title || !description) {
      setMessage("Please select a user and fill in all fields.");
      return;
    }

    const newTask = {
      title,
      description,
      assignedTo: selectedUser,
      dueDate,
      priority,
      status: defaultStatus || status,
    };

    // ✅ send to parent (AdminDashboard)
    onCreate(newTask);

    const selectedUsername = users.find(
      (user) => user._id === selectedUser
    );

    setMessage(
      `Task "${title}" assigned to ${selectedUsername?.name} created`
    );

    // ✅ reset form
    setTitle("");
    setDescription("");
    setSelectedUser("");
    setDueDate("");
    setPriority("");
    setStatus(defaultStatus || "todo");

    // ✅ auto hide message
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="create-task-wrapper">
      {/* ✅ BUTTON */}
      {compact && (
        <button
        className="create-task-toggle"
        onClick={() => setShowForm(!showForm)}
        >
        {showForm ? "Close" : "+"}
        </button>
      )}

      {/* ✅ MESSAGE */}
      {message && (
        <p
          className={
            message.startsWith("Please")
              ? "create-task-message error"
              : "create-task-message success"
          }
        >
          {message}
        </p>
      )}

      <h2 className="form-title">Create Task</h2>
      <hr className="form-divider" />
      {/* ✅ FORM */}
      {(showForm || !compact )&& (
        <form className="create-task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title :</label>
            <input
              className="create-task-input"
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Task Description :</label>
            <textarea
              className="create-task-input"
              type="text"
              placeholder="Enter Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className= "form-row-group">
            <div className="form-group">
              <label>Due Date</label>
              <input 
                className="create-task-input"
                type = "date"
                value ={dueDate}
                onChange ={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select
                  className ="create-task-select"
                  value ={priority}
                  onChange= {(e) => setPriority(e.target.value)}
                >
                <option value ="low"> Low</option>
                <option value ="medium"> Medium</option>
                <option value ="high"> High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Assign User :</label>
            <select
              className="create-task-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {!hideStatus && (
            <div className="form-group">
              <select
                className="create-task-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          <button className="create-task-submit" type="submit">
            Create Task
          </button>
        </form>
      )}
    </div>
  );
}

export default CreateTask;