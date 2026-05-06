//Navbar.js

import {useNavigate} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../Logo.png";
import "../styles/navbar.css";


function Navbar() {
    const navigate = useNavigate();
    const handleDashboard = () => {
    
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login");
            return;
        }
    try {
        const decoded = jwtDecode(token);

        if(decoded.role === "admin") {
        navigate("/AdminDashboard");
        } else{
            navigate("/UserDashboard");
        }
    } catch (error) {

        console.error("Invalid token");

        localStorage.removeItem("token");

        navigate("/login");
        }
    }
    const handleLogout = () => {

        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav>
            <div className="nav-brand">
                <img src={logo} alt="Sync-Space logo" />
                <span>Sync-Space</span>
            </div>
            <div className="nav-actions">
                <button onClick = {handleDashboard}> Dashboard</button>
                <button onClick = {handleLogout}> Logout</button>
            </div>
        </nav>
    );
    
}

export default Navbar;
