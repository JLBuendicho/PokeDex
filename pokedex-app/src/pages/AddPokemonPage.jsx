import { NavLink } from "react-router-dom";

function AddPokemon() {
  return (
    <div>
      <h2>Add Pokemon Page</h2>
      <NavLink to="/dashboard">
        <button>Return to Dash</button>
      </NavLink>
    </div>
  );
}

export default AddPokemon