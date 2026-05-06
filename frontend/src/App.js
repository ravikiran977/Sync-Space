import {BrowserRouter, Routes, Route} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateTask from "./components/CreateTask";
import './App.css';
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<Landing/>}/>
        
        <Route path ="/login" element ={<Login/>}/>

        <Route path ="/register" element ={<Register/>}/>

        <Route path ="/reset-password" element ={<ResetPassword/>}/>

        <Route path ="/forgot-password" element ={<ForgotPassword/>}/>

        <Route path = "/AdminDashboard" element = {
          <ProtectedRoute role= "admin">
            <AdminDashboard/>
          </ProtectedRoute>
        }/>

        <Route path = "/UserDashboard" element = {
          <ProtectedRoute role= "user">
            <UserDashboard/>
          </ProtectedRoute>
        }/>
        <Route path = "/CreateTask" element = {
          <ProtectedRoute role= "admin">
            <CreateTask/>
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
