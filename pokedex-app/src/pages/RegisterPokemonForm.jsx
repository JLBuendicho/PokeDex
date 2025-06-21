import { useState } from 'react';
import axios from 'axios'; // For Making HTTP requests
import { useNavigate } from 'react-router-dom'; // For Page Navigation After Form Submission
import "../styles/AuthPage.css";
import pokeLogo from '/poke.svg'; // Importing PokeLogo
import RoleProtectedNavButton from '../components/ProtectedNavButton';

const apiUrl = import.meta.env.VITE_API_BASE_URL

export default function RegisterPokemonForm() {
  // Local State To Store Form Input Values
  const [pokemon, setPokemon] = useState({
    name: '',
    type: '',
    hp: '',
    attack: '',
    defense: '',
    description: ''
  });

  const navigate = useNavigate(); // Hook For Navigation

  // Handle Changes In Input Fields And Update State
  const handleChange = (e) => {
    setPokemon({ ...pokemon, [e.target.name]: e.target.value }); // Update State With New Input Value
  };

  // When User Submits The Form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent Page Reload
    try {
      // Send POST Request To The API To Register New Pokemon
      await axios.post('http://${apiUrl}/api/pokemon', pokemon);
      navigate('/'); // Redirect User After Successful Creation
    } catch (err) {
      console.error('Error registering Pokémon:', err); // Log Any Errors
    }
  };

  return (
    <>
      <div className="auth-header">
        <img className="poke-logo" src={pokeLogo} alt="PokeLogo" />
      </div>
      <div className="auth-container">
        <h2>Register Pokémon</h2>
        {/* Form To Register New Pokémon */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Loop Through All Fields To Generate Inputs */}
          {Object.entries(pokemon).map(([key, value]) => (
            <div key={key} className='auth-field'>
              <label>{key.toUpperCase()}</label>
              <input
                name={key} // Set Input Name To The Pokemon Property
                value={value} // Set Input Value To The Current State Value
                onChange={handleChange} // Handle Input Changes
              />
            </div>
          ))}
          <button type="submit" className='auth-button'>Register Pokémon</button> {/* Submit Button */}
          <RoleProtectedNavButton navTo={"/manage-pokemon"} buttonText="Return to Manage Pokémon" allowedRoles={["Admin"]} />
        </form>
      </div>
    </>
  );
}
