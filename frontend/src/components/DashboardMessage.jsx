import React from "react";

function DashboardMessage({ message }) {
  if (!message) return null;

  return <p className="dashboard-message">{message}</p>;
}

export default DashboardMessage;
