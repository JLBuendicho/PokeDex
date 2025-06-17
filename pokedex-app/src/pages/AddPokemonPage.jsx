import { NavLink } from "react-router-dom";

function AddPokemon() {
  return (
    <div>
      <h1>Add Pokemon Page</h1>
      <NavLink to="/dashboard">
        <button>Return to Dash</button>
      </NavLink>
    </div>
  );
}

export default AddPokemon;
