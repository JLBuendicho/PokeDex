import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import "../styles/EntityManagerPage.css";
import RoleProtectedNavButton from "../components/ProtectedNavButton";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function ManageAdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${apiUrl}/api/users`);
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="entity-manager-container">
      <div className="entity-manager-header">
        <h2>Manage Admins</h2>
        <hr />
      </div>
      <div className="entity-list">
        {users
          .filter((user) => user.role === "Admin")
          .map((user) => (
            <Link key ={user.id} to={`/manage-admin/${user.id}`}><button className="entity-item">{user.username}</button></Link>
          ))}
      </div>
      <div className="entity-container">
        <Outlet />
      </div>
      <div className="entity-options">
        <RoleProtectedNavButton 
          navTo={"/register-admin"}
          buttonText="Register Admin"
          allowedRoles={["Admin"]}
        />
        <NavLink to="/dashboard">
          <button>Return to Dash</button>
        </NavLink>
      </div>
    </div>
  );
}

export default ManageAdminPage;
