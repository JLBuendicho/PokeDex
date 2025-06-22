import ProtectedNavButton from "../components/ProtectedNavButton";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/PokedexPage.css";
import PokeLogo from "/poke.svg";
import PokemonCard from "../components/PokemonCard.jsx";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function PokeDex() {
  const [typeFilter, setTypeFilter] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await axios.get(`${apiUrl}/api/pokemons`);
      setPokemons(response.data);
    };
    fetchPokemons();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Generate suggestions based on input
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, "i");
      const filteredSuggestions = pokemons
        .filter((pokemon) => regex.test(pokemon.name))
        .slice(0, 5); // Show top 5 matches
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Filter pokemons based on search and type
  const filteredPokemons = pokemons.filter((pokemon) => {
    const matchesSearch = searchInput
      ? pokemon.name.toLowerCase().includes(searchInput.toLowerCase())
      : true;

    const matchesType =
      typeFilter.length > 0
        ? pokemon.types.some((type) => typeFilter.includes(type))
        : true;

    return matchesSearch && matchesType;
  });

  return (
    <>
      <header className="header">
        <img src={PokeLogo} alt="PokeLogo" className="poke-logo" />
      </header>
      <div className="pokedex-container">
        <div className="pokedex-list">
          <p>Type</p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              flexDirection: "column",
            }}
          >
            {[
              "Normal",
              "Fire",
              "Water",
              "Grass",
              "Electric",
              "Ice",
              "Fighting",
              "Poison",
              "Ground",
              "Flying",
              "Psychic",
              "Bug",
              "Rock",
              "Ghost",
              "Dark",
              "Dragon",
              "Steel",
              "Fairy",
            ].map((typeOption) => (
              <label
                key={typeOption}
                style={{
                  minWidth: "100px",
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <input
                  type="checkbox"
                  name="Types"
                  value={typeOption}
                  checked={typeFilter.includes(typeOption)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTypeFilter([...typeFilter, e.target.value]);
                    } else {
                      setTypeFilter(typeFilter.filter(type => type !== e.target.value));
                    }
                  }}
                />
                {typeOption}
              </label>
            ))}
          </div>
        </div>
        <div className="pokedex-content">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchInput}
              onChange={handleSearchChange}
              className="search-input"
            />
            {suggestions.length > 0 && (
              <div className="suggestions-container">
                {suggestions.map(pokemon => (
                  <div
                    key={pokemon.id}
                    className="suggestion-item"
                    onClick={() => {
                      setSearchInput(pokemon.name);
                      setSuggestions([]);
                    }}
                  >
                    {pokemon.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="pokemons">
            {filteredPokemons.map((pokemon) => (
              <Link key={pokemon.id} to={`/pokemon/${pokemon.id}`}>
                <PokemonCard pokemon={pokemon} />
              </Link>
            ))}
          </div>
        </div>
        <div className="pokedex-options">
          <ProtectedNavButton
            navTo="/dashboard"
            buttonText="Return to Dashboard"
          />
        </div>
      </div>
    </>
  );
}

export default PokeDex;
