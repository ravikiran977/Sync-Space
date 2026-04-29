//import React,{useState, useEffect} from "react";
//import axios from "axios";
//import Navbar from "../components/Navbar.js";

function AdminDashboard() {
    const [tasks, setTasks] = useState([]);
    const [message, setMessage] = useState("");
    const [ activecard, setActiveCard] = useState(null);

    useEffect(() => {

        const fetchTasks = async() =>{
            try{
                const token =localStorage.getItem("token")

                const response = await axios.get("http://localhost:5000/api/tasks",{
                    headers:{
                        Authorization :`Bearer ${token}`, },
                });
                console.log(response.data);
                setTasks(response.data);
            } catch (error){
                console.error("Error fetching tasks:", error);
            }
        }
        fetchTasks();
    }, []);
    const handleDeleteTask = async (taskId)=> {
        try{
            const token  = localStorage.getItem("token");

            const taskToDelete = tasks.find((task) => task._id === taskId);;
             await axios.delete(`http://localhost:5000/api/tasks/${taskId}`,{
                headers : {
                    Authorization : `Bearer ${token}`,
                },
                
             });
            console.log("task" + taskToDelete.title + "deleted successfully");
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

            setMessage(`Task ${taskToDelete.title} deleted successfully`);


        }catch (error){
            console.error("Error deleting task:", error);
        }

    }
    const handleUpdateTask = async(taskId, newStatus) => {
        try{
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/tasks/${taskId}`,
                {status: newStatus},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setTasks((prevTasks) =>  prevTasks.map((task) => task._id === taskId ?{...task, status: newStatus}:task) ); //update the task UI upon chnaging

        }catch (error) {
            console.error("Error updating Status", error);
        }
    };

    const todoTasks = tasks.filter((task) => task.status === "todo");
    const inprogressTasks = tasks.filter((task)=> task.status === "in-progress");
    const reviewTasks = tasks.filter ((task) => task.status === "review")
    const completedTasks = tasks.filter((task) => task.status === "completed");


    return(
        <div>
            <Navbar />
            <h2>Admin Dashboard</h2>
            <div style={{display:"flex", gap:"20px"}}>
                <div>
                    <h3> To DO </h3>
                    {todoTasks.map((task) =>(
                        <div className="task-card" draggable= "true"
                        key ={task._id}
                        style = {{
                            background :"fff",
                            padding:"10px",
                            marginBottom:"10px",
                            borderRadius:"8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}>
                            <h4 style ={{margin:"0 0 5px 0" }}>{task.title}</h4>
                            <p style ={{margin:"0 0 5px 0", fontSize:"14px"}}>{task.description}</p>
                            <p style={{fontSize:"12px", color:"blue"}}>Assigned:{task.assignedTo?.name || "Unassigned"}</p>
                            <button onClick={() => handleUpdateTask(task._id, "in-progress")}>Move to Inprogress </button>
                            <button onClick ={() => handleDeleteTask( task._id)}>Delete</button>
                        </div>
                    ))}
                </div>

                <div>
                    <h3> In-Progress </h3>
                    {inprogressTasks.map((task) =>(
                        <div className="taskcard" draggable ="true"
                        key ={task._id}
                        style = {{
                            background :"fff",
                            padding:"10px",
                            marginBottom:"10px",
                            borderRadius:"8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}>
                            <h4 style ={{margin:"0 0 5px 0" }}>{task.title}</h4>
                            <p style ={{margin:"0 0 5px 0", fontSize:"14px"}}>{task.description}</p>
                            <p style={{fontSize:"12px", color:"blue"}}>Assigned:{task.assignedTo?.name || "Unassigned"}</p>
                            <button onClick={() => handleUpdateTask(task._id, "in-progress")}>Move to Review </button> 
                            <button onClick ={() => handleDeleteTask( task._id)}>Delete</button>
                        </div>
                    ))}
                </div>

                <div>
                    <h3> Review </h3>
                    {reviewTasks.map((task) =>(
                        <div className="task-card" draggable="true"
                        key ={task._id}
                        style = {{
                            background :"fff",
                            padding:"10px",
                            marginBottom:"10px",
                            borderRadius:"8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}>
                            <h4 style ={{margin:"0 0 5px 0" }}>{task.title}</h4>
                            <p style ={{margin:"0 0 5px 0", fontSize:"14px"}}>{task.description}</p>
                            <p style={{fontSize:"12px", color:"blue"}}>Assigned:{task.assignedTo?.name || "Unassigned"}</p>
                            <button onClick={() => handleUpdateTask(task._id, "in-progress")}>Move to completed </button>
                            <button onClick ={() => handleDeleteTask( task._id)}>Delete</button>
                        </div>
                    ))}
                </div>

                <div>
                    <h3> Completed </h3>
                    {completedTasks.map((task) =>(
                        <div className="task-card" draggable= "true" 
                        key ={task._id}
                        style = {{
                            background :"fff",
                            padding:"10px",
                            marginBottom:"10px",
                            borderRadius:"8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                        }}>
                            <h4 style ={{margin:"0 0 5px 0" }}>{task.title}</h4>
                            <p style ={{margin:"0 0 5px 0", fontSize:"14px"}}>{task.description}</p>
                            <p style={{fontSize:"12px", color:"blue"}}>Assigned:{task.assignedTo?.name || "Unassigned"}</p>
                            <button onClick ={() => handleDeleteTask( task._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
            
            {message && <p style={{ color: "green" }}>{message}</p>}
        </div>
    )
}
export default AdminDashboard;