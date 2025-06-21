import RoleProtectedNavButton from "../components/ProtectedNavButton";
import ProtectedNavButton from "../components/ProtectedNavButton";

function ManagePokemon() {
  return (
    <div>
      <h1>Add Pokemon Page</h1>
      <ProtectedNavButton navTo="/dashboard" buttonText="Return to Dashboard" />
      <RoleProtectedNavButton navTo={"/manage-pokemon/register-pokemon"} buttonText="Register Pokemon" allowedRoles={["Admin"]} />
    </div>
  );
}

export default ManagePokemon;
