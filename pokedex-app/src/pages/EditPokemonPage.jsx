import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import pokeLogo from "/poke.svg";
import RoleProtectedNavButton from "../components/ProtectedNavButton";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Utility function to crop images
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
      // Save as PNG
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/png");
    };
    image.onerror = reject;
  });
}

function EditPokemonPage() {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Image handling state
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${apiUrl}/api/pokemons/${id}`);
        const data = res.data;

        setPokemon({
          Name: data.Name ?? data.name ?? "",
          Types: data.Types ?? data.types ?? [],
          HP: Number(data.HP ?? data.hp ?? 0),
          Attack: Number(data.Attack ?? data.attack ?? 0),
          Defense: Number(data.Defense ?? data.defense ?? 0),
          Description: data.Description ?? data.description ?? "",
          ImageUrl: data.ImageUrl ?? data.imageUrl ?? ""
        });
        
        // Set initial preview with cache busting
        if (data.ImageUrl || data.imageUrl) {
          setPreview(`${apiUrl}${data.ImageUrl || data.imageUrl}?t=${Date.now()}`);
        }
      } catch (err) {
        setError("Failed to load Pokémon data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? Number(value) : value;
    setPokemon({ ...pokemon, [name]: val });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setShowCrop(true);
    }
  };

  // Handle crop completion
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Save cropped image
  const handleCropSave = async () => {
    if (!preview || !croppedAreaPixels) return;
    
    try {
      const croppedBlob = await getCroppedImg(
        preview,
        croppedAreaPixels,
        zoom,
        1
      );
      
      // Create PNG file
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Append Pokémon data
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

      const response = await axios.put(
        `${apiUrl}/api/pokemons/${id}`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        }
      );

      setSuccess("Pokémon updated successfully!");
      
      // Update preview with new image
      if (imageFile) {
        setPreview(URL.createObjectURL(imageFile) + `?t=${Date.now()}`);
      }
      
      // Navigate back after success
      navigate("/manage-pokemon");
      
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${apiUrl}/api/pokemons/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setSuccess("Pokémon deleted successfully!");
      navigate("/manage-pokemon");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete Pokémon");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="auth-container">Loading...</div>;
  if (error) return <div className="auth-container">{error}</div>;
  if (!pokemon) return <div className="auth-container">Pokémon not found</div>;

  return (
    <>
      <div className="auth-header">
        <img className="poke-logo" src={pokeLogo} alt="PokeLogo" />
      </div>
      <div className="auth-container">
        <h2>Edit Pokémon</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
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

          <div className="auth-field">
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
                      const newTypes = e.target.checked
                        ? [...pokemon.Types, typeOption]
                        : pokemon.Types.filter((t) => t !== typeOption);

                      setPokemon({ ...pokemon, Types: newTypes });
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
            {loading ? "Updating..." : "Update Pokémon"}
          </button>
        </form>
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        <button className="auth-button" disabled={loading} onClick={() => setShowDeleteModal(true)}>
            {loading ? "Deleting..." : "Delete Pokémon"}
        </button>
        <RoleProtectedNavButton
            navTo="/manage-pokemon"
            buttonText="Cancel"
            allowedRoles={["Admin"]}
        />
        {showDeleteModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Delete Pokemon</h3>
              <p>
                Are you sure you want to delete this Pokemon?
                <br />
                This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="auth-button"
                  style={{ background: "#888" }}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="auth-button"
                  style={{ background: "#d32f2f" }}
                  onClick={() => {
                    setShowDeleteModal(false);
                    handleDelete();
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EditPokemonPage;