import { useState, useEffect, use } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import * as jwt_decode from "jwt-decode";
import ProtectedNavButton from "./ProtectedNavButton.jsx";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function ProfilePage() {
  const { isOutlet = false } = useOutletContext() || {};
  const [profile, setProfile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.id;

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(`${apiUrl}/api/users/${userId}`);
      setProfile(response.data);
    };
    fetchProfile();
  }, [userId]);

  // Get current user ID from JWT
  let currentUserId = null;
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt_decode.default(token);
      currentUserId = decoded["nameid"] || decoded["sub"] || decoded["id"];
    } catch (e) {
      currentUserId = null;
    }
  }

  const handleDelete = async () => {
    console.log("handleDelete called");
    try {
      await axios.delete(`${apiUrl}/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      if (!isOutlet) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.log("Delete error:", err);
      alert(
        err.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    }
  };

  console.log("Profile data:", profile);

  return (
    <div>
      {profile ? (
      <div>
        <div>
          <img
            className="profile-picture"
            src={`${apiUrl}${profile.profilePictureUrl}`}
            alt="Profile"
          />
          <div>
            <p>Username: {profile.username}</p>
            <p>Email: {profile.email}</p>
            <p>Role: {profile.role}</p>
          </div>
        </div>
        <div className="button-container">
          <button onClick={() => setShowDeleteModal(true)}>Delete Account</button>
          {isOutlet ? null : (
            <>
              <ProtectedNavButton
                navTo={`/edit-profile/${userId}`}
                buttonText="Edit Profile"
              />
              <ProtectedNavButton
                navTo="/dashboard"
                buttonText="Return to Dashboard"
              />
            </>
          )}
        </div>
        {showDeleteModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Delete Account</h3>
              <p>
                Are you sure you want to delete your account?
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
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}
export default ProfilePage;
