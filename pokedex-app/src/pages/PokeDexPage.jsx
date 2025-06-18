import ProtectedNavButton from "../components/ProtectedNavButton";

function PokeDex() {
  return (
    <div>
      <h2>Pokedex Page</h2>
      <ProtectedNavButton navTo="/dashboard" buttonText="Return to Dashboard" />
    </div>
  );
}

export default PokeDex;
