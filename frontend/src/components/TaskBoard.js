//TaskBoard.js

import React from "react";
import TaskColumn from "./TaskColumn";

function TaskBoard({ tasks, onDelete, onUpdate,activeColumn, setActiveColumn,onCreate }) {
  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status);

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <TaskColumn
        title="To Do"
        status= "todo"
        tasks={getTasksByStatus("todo")}
        onCreate ={onCreate}
        onDelete={onDelete}
        onUpdate={onUpdate}
        activeColumn={activeColumn}
        setActiveColumn={setActiveColumn}
        
      />

      <TaskColumn
        title="In Progress"
        status= "in-progress"
        tasks={getTasksByStatus("in-progress")}
        onCreate ={onCreate}
        onDelete={onDelete}
        onUpdate={onUpdate}
        activeColumn={activeColumn}
        setActiveColumn={setActiveColumn}
        
      />

      <TaskColumn
        title="Review"
        status= "review"
        tasks={getTasksByStatus("review")}
        onCreate ={onCreate}
        onDelete={onDelete}
        onUpdate={onUpdate}
        activeColumn={activeColumn}
        setActiveColumn={setActiveColumn}
        
      />

      <TaskColumn
        title="Completed"
        status= "completed"
        tasks={getTasksByStatus("completed")}
        onCreate ={onCreate}
        onDelete={onDelete}
        onUpdate={onUpdate}
        activeColumn={activeColumn}
        setActiveColumn={setActiveColumn}
        
      />
    </div>
  );
}

export default TaskBoard;