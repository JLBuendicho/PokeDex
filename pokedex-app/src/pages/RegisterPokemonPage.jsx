import { useState, useCallback } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import "../styles/AuthPage.css";
import pokeLogo from "/poke.svg";
import RoleProtectedNavButton from "../components/ProtectedNavButton";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Utility function to crop images (same as EditProfilePage)
function getCroppedImg(imageSrc, crop, zoom, aspect) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      
      // Save as PNG instead of JPEG
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/png"); // Changed to PNG format
    };
    image.onerror = reject;
  });
}

function RegisterPokemonPage() {
  const [pokemon, setPokemon] = useState({
    Name: "",
    Types: [],
    HP: 0,
    Attack: 0,
    Defense: 0,
    Description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (["HP", "Attack", "Defense"].includes(name)) {
      setPokemon({
        ...pokemon,
        [name]: value === "" ? "" : parseInt(value, 10),
      });
    } else {
      setPokemon({ ...pokemon, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setShowCrop(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (!preview || !croppedAreaPixels) return;
    
    try {
      const croppedBlob = await getCroppedImg(
        preview,
        croppedAreaPixels,
        zoom,
        1
      );
      
      const croppedFile = new File([croppedBlob], "pokemon.png", {
        type: "image/png",
      });
      
      setImageFile(croppedFile);
      setPreview(URL.createObjectURL(croppedBlob));
      setShowCrop(false);
    } catch (err) {
      setError("Failed to crop image");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Append all form data as text fields
      formData.append("Name", pokemon.Name);
      formData.append("HP", pokemon.HP.toString());
      formData.append("Attack", pokemon.Attack.toString());
      formData.append("Defense", pokemon.Defense.toString());
      formData.append("Description", pokemon.Description);
      
      // Append each type individually
      pokemon.Types.forEach(type => {
        formData.append("Types", type);
      });
      
      // Append image if available
      if (imageFile) {
        formData.append("Image", imageFile);
      }

      const response = await axios.post(
        `${apiUrl}/api/pokemons/register`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        }
      );

      setSuccess(
        `${response.data.name}, successfully registered! You can now view it in the Pokémon list.`
      );
      
      // Reset form
      setPokemon({
        Name: "",
        Types: [],
        HP: 0,
        Attack: 0,
        Defense: 0,
        Description: "",
      });
      
      // Reset image
      setImageFile(null);
      setPreview(null);
      setShowCrop(false);
    } catch (err) {
      console.log(err);
      setError(err.response?.data || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <img className="poke-logo" src={pokeLogo} alt="PokeLogo" />
      </div>
      <div className="auth-container">
        <h2>Register Pokémon</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="Name">Name:</label>
            <input
              id="Name"
              name="Name"
              placeholder="Enter Pokémon Name"
              value={pokemon.Name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="pokedex-list">
            <label>Type:</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
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
                <label key={typeOption} style={{ minWidth: "100px" }}>
                  <input
                    type="checkbox"
                    name="Types"
                    value={typeOption}
                    checked={pokemon.Types.includes(typeOption)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPokemon({
                          ...pokemon,
                          Types: [...pokemon.Types, typeOption],
                        });
                      } else {
                        setPokemon({
                          ...pokemon,
                          Types: pokemon.Types.filter((t) => t !== typeOption),
                        });
                      }
                    }}
                  />
                  {typeOption}
                </label>
              ))}
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="HP">HP:</label>
            <input
              id="HP"
              name="HP"
              type="number"
              placeholder="Enter Pokémon HP"
              value={pokemon.HP}
              onChange={handleChange}
              min={1}
              max={500}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="Attack">Attack:</label>
            <input
              id="Attack"
              name="Attack"
              type="number"
              placeholder="Enter Pokémon Attack"
              value={pokemon.Attack}
              onChange={handleChange}
              min={1}
              max={500}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="Defense">Defense:</label>
            <input
              id="Defense"
              name="Defense"
              type="number"
              placeholder="Enter Pokémon Defense"
              value={pokemon.Defense}
              onChange={handleChange}
              min={1}
              max={500}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="Description">Description:</label>
            <textarea
              id="Description"
              name="Description"
              placeholder="Enter Pokémon Description"
              value={pokemon.Description}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Image Upload Section */}
          <div className="auth-field">
            <label htmlFor="image">Pokémon Image:</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>
          
          {/* Image Cropping UI */}
          {showCrop && preview && (
            <>
              <div 
                className="cropper-container" 
                style={{ 
                  position: 'relative', 
                  height: '300px', 
                  width: '100%',
                  marginBottom: '20px'
                }}
              >
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <button
                type="button"
                className="auth-button"
                onClick={handleCropSave}
                disabled={loading}
              >
                Save Crop
              </button>
            </>
          )}
          
          {/* Image Preview */}
          {preview && !showCrop && (
            <div className="image-preview" style={{ textAlign: 'center', margin: '20px 0' }}>
              <img 
                src={preview} 
                alt="Pokémon Preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
          )}
          
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registering..." : "Register Pokémon"}
          </button>
        </form>
        <RoleProtectedNavButton
            navTo={"/manage-pokemon"}
            buttonText="Return to Manage Pokémon"
            allowedRoles={["Admin"]}
          />
      </div>
    </>
  );
}

export default RegisterPokemonPage;