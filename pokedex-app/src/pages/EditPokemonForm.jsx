import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_BASE_URL

export default function EditPokemonForm() {
  // Local State To Store the Pokemon Data
  const [pokemon, setPokemon] = useState({
    name: '',
    type: '',
    hp: '',
    attack: '',
    defense: '',
    description: ''
  });

  // Retrieve Pokemon ID From The URL Parameters
  const { id } = useParams();
  const navigate = useNavigate(); // Hook For Navigation

  useEffect(() => {
    // Fetch Existing Pokemon Data When The Component Mounts
    axios.get(`${apiUrl}/api/pokemon/${id}`)
      .then(res => setPokemon(res.data)) // Set the Fetched Data To State
      .catch(err => console.error('Failed to fetch Pokémon:', err)); // Log Any Errors
  }, [id]); // Dependency Array Includes id To Refetch If It Changes

// Handle Changes In Input Fields
  const handleChange = (e) => {
    setPokemon({ ...pokemon, [e.target.name]: e.target.value }); // Update State With New Input Value
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent Default Form Submission Behavior
    try {
      // Send PUT Request To Update The Existing Pokemon
      await axios.put(`http://${apiUrl}/api/pokemon/${id}`, pokemon);
      navigate('/'); // Redirect To Home Page After Successful Update
    } catch (err) {
      console.error('Error Updating Pokémon:', err); // Log Any Errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render Input Fields For Each Property Of The Pokemon */}
      {Object.entries(pokemon).map(([key, value]) => (
        <div key={key}>
          <label>{key.toUpperCase()}</label>
          <input
            name={key} // Set Input Name To The Pokemon Property
            value={value} // Set Input Value To The Current State Value
            onChange={handleChange} // Handle Input Changes
          />
        </div>
      ))}
      <button type="submit">Update Pokémon</button> {/* Submit Button */}
    </form>
  );
}
