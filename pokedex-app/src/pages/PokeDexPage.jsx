import { NavLink } from "react-router-dom";

function PokeDex() {
  return (
    <div>
      <h1>Pokedex Page</h1>
      <NavLink to="/dashboard">
        <button>Return to Dash</button>
      </NavLink>
    </div>
  );
}

export default PokeDex;
