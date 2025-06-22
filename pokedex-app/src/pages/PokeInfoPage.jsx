import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PokeInfoPage.css";
import pokeLogo from "/poke.svg";
import ProtectedNavButton from "../components/ProtectedNavButton";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function PokeInfoPage() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const pokeId = params.id;

  useEffect(() => {
    const fetchPoke = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/api/pokemons/${pokeId}`);
        // Add cache-busting timestamp to pokemon data
        setPokemon({
          ...response.data,
          _cacheBust: Date.now(), // Unique timestamp for cache busting
        });
      } catch (err) {
        setError(err.message || "Failed to fetch Pokémon");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (pokeId) fetchPoke();
  }, [pokeId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pokemon) return <div>No Pokémon found</div>;

  let pokeImageUrl = null;
  if (pokemon?.imageUrl) {
    let url = pokemon.imageUrl;

    // Prepend API URL only for relative paths
    if (!/^https?:\/\//i.test(url)) {
      url = `${apiUrl}${url}`;
    }

    // Add cache-busting timestamp parameter
    const separator = url.includes("?") ? "&" : "?";
    pokeImageUrl = `${url}${separator}ts=${pokemon._cacheBust}`;
  }

  console.log("pokemon:", pokemon);

  return (
    <>
      <div>
        <img src={pokeLogo} alt="PokeLogo" className="poke-logo" />
      </div>
      <div className="poke-info-card">
        {pokemon ? (
          <img
            className="poke-pic"
            src={pokeImageUrl}
            alt="Profile"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.onerror = null;
              e.target.parentNode.replaceChild(
                document.createTextNode("No pokemon image"),
                e.target
              );
            }}
          />
        ) : (
          <div>No pokemon image</div>
        )}
        <div className="poke-info">
          <h2>{pokemon.name}</h2>
          <h3>{pokemon.description}</h3>
          <div className="poke-type-container">
            <p>Types:</p>
            <div className="poke-types">
              {pokemon.types.length > 0 ? (
                pokemon.types.map((type, index) => <p key={index}>{type}</p>)
              ) : (
                <p>Normal</p>
              )}
            </div>
          </div>
          <div className="poke-stats">
            <p>HP: {pokemon.hp}</p>
            <p>DEF: {pokemon.defense}</p>
            <p>ATK: {pokemon.attack}</p>
          </div>
        </div>
        <div className="poke-info-options">
          <ProtectedNavButton
            navTo="/pokedex"
            buttonText="Return to Pokedex"
          />
        </div>
      </div>
    </>
  );
}
export default PokeInfoPage;
