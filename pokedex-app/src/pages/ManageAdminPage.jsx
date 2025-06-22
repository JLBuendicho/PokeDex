import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";
import "../styles/EntityManagerPage.css";
import RoleProtectedNavButton from "../components/ProtectedNavButton";
import ProtectedNavButton from "../components/ProtectedNavButton";
import pokeLogo from "/poke.svg";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function ManageAdminPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${apiUrl}/api/users`);
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  // Filter admins based on search term
  const filteredAdmins = users.filter(user => 
    user.role === "Admin" && 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="header">
        <img src={pokeLogo} alt="PokeLogo" className="poke-logo" />
      </header>
      <div className="entity-manager-container">
        <div className="entity-manager-header">
          <h2>Manage Admins</h2>
          <hr />
        </div>
        
        <div className="entity-list">
          <div className="entity-search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="entity-search-input"
            />
          </div>
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((user) => (
              <Link key={user.id} to={`/manage-admin/${user.id}`}>
                <button className="entity-item">{user.username}</button>
              </Link>
            ))
          ) : (
            <p className="no-results-message">
              {searchTerm ? "No matching admins found" : "No admins available"}
            </p>
          )}
        </div>
        
        <div className="entity-container">
          <Outlet context={{isOutlet: true}} />
        </div>
        
        <div className="entity-options">
          <RoleProtectedNavButton
            navTo={"/register-admin"}
            buttonText="Register Admin"
            allowedRoles={["Admin"]}
          />
          <ProtectedNavButton
            navTo="/dashboard"
            buttonText="Return to Dashboard"
          />
        </div>
      </div>
    </>
  );
}

export default ManageAdminPage;