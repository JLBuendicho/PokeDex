import { useAuth } from "../context/AuthContext";
import ProtectedNavButton from "../components/ProtectedNavButton";
import RoleProtectedNavButton from "../components/RoleProtectedNavButton";

function Dashboard() {
  const { user, logout } = useAuth();
  console.log("User object:", user); // This will show you the structure in the browser console
  return (
    <div>
      <h1>
        Welcome to Pokedex!<br />
        {user?.username || user?.name || user?.email || "user"}
      </h1>
      <RoleProtectedNavButton
        navTo="/manage-admin"
        buttonText="Manage Admins"
        allowedRoles={["Admin"]}
      />
      <RoleProtectedNavButton
        navTo="/add-pokemon"
        buttonText="Add Pokemon"
        allowedRoles={["Admin"]}
      />
      <ProtectedNavButton navTo="/pokedex" buttonText="PokeDex" />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
