import ProtectedNavButton from "../components/ProtectedNavButton";

function AddPokemon() {
  return (
    <div>
      <h1>Add Pokemon Page</h1>
      <ProtectedNavButton navTo="/dashboard" buttonText="Return to Dashboard" />
    </div>
  );
}

export default AddPokemon;
