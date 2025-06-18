import { useAuth } from "../context/AuthContext";
import ProtectedNavButton from "../components/ProtectedNavButton";
import RoleProtectedNavButton from "../components/RoleProtectedNavButton";
import pokeLogo from "/poke.svg";

function Dashboard() {
  const { user, logout } = useAuth();
  console.log("User object:", user); // This will show you the structure in the browser console
  return (
    <div>
      <img className="poke-logo" src={pokeLogo} alt="PokeLogo" />
      <h2>Welcome to Pokedex, {user?.username || "user"}!</h2>
      <div className="button-container">
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
        <ProtectedNavButton navTo={`/profile/${user?.id}`} buttonText="Profile" />
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
