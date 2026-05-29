import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import "../styles/InviteUsersModal.css";

function InviteUsersModal({ isOpen, onClose, project, onInvited }) {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [invitingUsers, setInvitingUsers] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !project?._id) return;

    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setError("");
        setSelectedUserIds([]);

        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const usersOutsideProject = (response.data || []).filter((user) => {
          const userProjects = user.projects || [];
          return !userProjects.some((userProject) => {
            const userProjectId = typeof userProject === "string" ? userProject : userProject._id;
            return userProjectId === project._id;
          });
        });

        setUsers(usersOutsideProject);
      } catch (error) {
        console.error(error);
        setError("Could not load users to invite.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [isOpen, project?._id]);

  const toggleUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleInvite = async () => {
    if (selectedUserIds.length === 0) {
      setError("Select at least one user to invite.");
      return;
    }

    try {
      setInvitingUsers(true);
      setError("");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `http://localhost:5000/api/projects/${project._id}/users`,
        { userIds: selectedUserIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onInvited?.(response.data);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Could not invite selected users.");
    } finally {
      setInvitingUsers(false);
    }
  };

  const handleClose = () => {
    setError("");
    setSelectedUserIds([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="invite-users-modal">
        <div className="invite-users-header">
          <p className="dashboard-label">Project access</p>
          <h2>Invite Users</h2>
          <span>{project?.name || "Selected project"}</span>
        </div>

        {error && <div className="dashboard-error invite-error">{error}</div>}

        {loadingUsers ? (
          <div className="dashboard-loading invite-loading">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="invite-empty-state">All users are already in this project.</div>
        ) : (
          <div className="invite-user-list">
            {users.map((user) => (
              <label key={user._id} className="invite-user-row">
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user._id)}
                  onChange={() => toggleUser(user._id)}
                />
                <span className="invite-user-info">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </span>
                <span className="invite-user-role">{user.role}</span>
              </label>
            ))}
          </div>
        )}

        <div className="invite-actions">
          <button className="secondary-action-btn" type="button" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="primary-btn"
            type="button"
            onClick={handleInvite}
            disabled={invitingUsers || selectedUserIds.length === 0}
          >
            {invitingUsers ? "Inviting..." : "Invite Selected"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default InviteUsersModal;
