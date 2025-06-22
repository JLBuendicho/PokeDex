import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cropper from "react-easy-crop";
import pokeLogo from "/poke.svg";
import ProtectedNavButton from "../components/ProtectedNavButton";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

// Updated to output PNG instead of JPEG
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
      // Changed to output PNG
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/png"); // Changed from "image/jpeg"
    };
    image.onerror = reject;
  });
}

function EditProfilePage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  console.log("EditProfilePage params:", params);
  console.log("axios call", `${apiUrl}/api/users/${params.id}`);

  // Fetch current user info on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${apiUrl}/api/users/${params.id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data);
        setUsername(res.data.username || "");
        // Add cache-busting parameter to prevent cached images
        setPreview(
          res.data.profilePictureUrl 
            ? `${apiUrl}${res.data.profilePictureUrl}?t=${Date.now()}`
            : null
        );
      } catch (err) {
        setError("Failed to load user info.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  // If user changes, update username and preview
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      if (!profilePicture) {
        // Add cache-busting parameter
        setPreview(
          user.profilePictureUrl 
            ? `${apiUrl}${user.profilePictureUrl}?t=${Date.now()}`
            : null
        );
      }
    }
  }, [user]);

  // Handle profile picture preview and cropping
  useEffect(() => {
    if (!profilePicture) return;
    const objectUrl = URL.createObjectURL(profilePicture);
    setPreview(objectUrl);
    setShowCrop(true);
    return () => URL.revokeObjectURL(objectUrl);
  }, [profilePicture]);

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
      // Save as PNG file
      setProfilePicture(
        new File([croppedBlob], "profile.png", { type: "image/png" })
      );
      setPreview(URL.createObjectURL(croppedBlob));
      setShowCrop(false);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (err) {
      setError("Failed to crop image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("currentPassword", currentPassword);
      if (newPassword) formData.append("newPassword", newPassword);
      if (profilePicture) formData.append("profilePicture", profilePicture);
      
      await axios.put(`${apiUrl}/api/users/${params.id}`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      setSuccess("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Refetch user info to update fields
      const res = await axios.get(`${apiUrl}/api/users/${params.id}`, {
        withCredentials: true,
      });
      setUser(res.data);
      
      // Force preview to update with cache-busting param
      if (res.data.profilePictureUrl) {
        setPreview(`${apiUrl}${res.data.profilePictureUrl}?t=${Date.now()}`);
      }
      
      setProfilePicture(null);
      navigate(`/profile/${params.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <div>Loading...</div>;
  if (error && !user) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <>
      <div className="auth-header">
        <img className="poke-logo" src={pokeLogo} alt="PokeLogo" />
      </div>
      <div className="auth-container">
        <h2>Edit Profile</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={32}
              autoComplete="username"
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="currentPassword">Current Password:</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your current password"
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="newPassword">New Password:</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              autoComplete="new-password"
              placeholder="Leave blank to keep current password"
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              autoComplete="new-password"
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="profilePicture">Profile Picture:</label>
            <input
              id="profilePicture"
              name="profilePicture"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
              disabled={loading}
            />
          </div>
          {showCrop && preview && (
            <>
              <div className="cropper-container">
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
                style={{
                  display: "block",
                  margin: "10px auto 0 auto",
                  zIndex: 10,
                }}
                onClick={handleCropSave}
              >
                Save Crop
              </button>
            </>
          )}
          {preview && !showCrop && (
            <img
              src={preview}
              alt="Profile Preview"
              className="profile-picture"
              style={{ maxWidth: "200px", margin: "10px auto" }}
            />
          )}
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <ProtectedNavButton
            navTo={`/profile/${params.id}`}
            buttonText="Cancel"
            style={{ marginTop: "10px" }}
          />
        </form>
      </div>
    </>
  );
}

export default EditProfilePage;
