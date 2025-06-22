const apiUrl = import.meta.env.VITE_API_BASE_URL;

function PokemonCard({ pokemon }) {
  return (
    <div className="poke-card">
      <img
        src={`${apiUrl}${pokemon.imageUrl}`}
        alt={pokemon.name}
        className="profile-picture"
      />
      <p style={{ margin: "0 0" }}>{pokemon.name}</p>
    </div>
  );
}
export default PokemonCard;