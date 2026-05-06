//Taskcolumn.js

import React, { useState } from "react";
import TaskCard from "./TaskCard";
import CreateTask  from "./CreateTask";
import Modal from "./Modal";
import "../styles/TaskColumn.css"

function TaskColumn({ title, tasks, onDelete, onUpdate, status, activeColumn, setActiveColumn, onCreate}) {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragOver = (e) =>{
    e.preventDefault();
    setActiveColumn(status);
    console.log("drag over triggered", title)

    if(activeColumn !== status){
      setActiveColumn(status);
    }
  };

  /* const handleDragLeave = (e) =>{
    e.currentTarget.classList.remove("drag-over");
    console.log("drag leave triggered", title)
  }; */
  const handleDrop =(e) => {
    e.preventDefault();
    console.log("drop triggered", title)

    const taskId = e.dataTransfer.getData("taskId");

    setActiveColumn(null);

    if(onUpdate) {
      onUpdate(taskId,status);
   }
  };
  return (
    <div className = {`task-column ${activeColumn === status? "drag-over" : ""}`} style={{ flex: 1 }} onDragOver ={handleDragOver} onDrop= {handleDrop}>
      <div className="title-row">
        <h3>{title}</h3>
        {/*} <CreateTask
          onCreate={onCreate}
          defaultStatus={status}
          hideStatus={true}
        /> */}
        <button className="add-task-btn" onClick={() => setIsModalOpen(true)}>+</button>

      </div>

      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          
        />
      ))}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        >
        <CreateTask 
        onCreate={(task) => {
        onCreate(task);
        setIsModalOpen(false); // close modal after create
        }}
        defaultStatus={status}
        hideStatus={true}
        compact ={false}
        />
      </Modal>
    </div>

    
  );
}

export default TaskColumn;