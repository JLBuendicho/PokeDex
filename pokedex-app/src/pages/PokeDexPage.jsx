import { NavLink } from "react-router-dom";

function PokeDex() {
  return (
    <div>
      <h2>Pokedex Page</h2>
      <NavLink to="/dashboard">
        <button>Return to Dash</button>
      </NavLink>
    </div>
  );
}

export default PokeDex