import { useAuth } from "../context/AuthContext";
import ProtectedNavButton from "../components/ProtectedNavButton";
import RoleProtectedNavButton from "../components/RoleProtectedNavButton";

function Dashboard() {
  const { user, logout } = useAuth();
  console.log("User object:", user); // This will show you the structure in the browser console
  return (
    <div>
      <h2>
        Login successful! Hello{" "}
        {user?.username || user?.name || user?.email || "user"}
      </h2>
      <RoleProtectedNavButton
        navTo="/add-pokemon"
        buttonText="Add Pokemon"
        allowedRoles={["Admin"]}
      />
      <ProtectedNavButton 
        navTo="/pokedex"
        buttonText="PokeDex"
      />
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
