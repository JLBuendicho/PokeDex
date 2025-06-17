import { useState, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import "../styles/EntityManagerPage.css";

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
        <h1>Manage Admins</h1>
        <hr />
      </div>
      <div className="entity-list">
        {users
          .filter((user) => user.role === "Admin")
          .map((user) => (
            <Link key ={user.id} to={`/manage-admin/${user.id}`}><div className="entity-item">{user.id} {user.username}</div></Link>
          ))}
      </div>
      <div className="entity-container">
        <Outlet />
      </div>
      <div className="return-button">
        <NavLink to="/dashboard">
        <button>Return to Dash</button>
      </NavLink>
      </div>
    </div>
  );
}

export default ManageAdminPage;
