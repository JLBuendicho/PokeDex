import { useState, useEffect } from "react";
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
      // Add cache-busting timestamp to profile data
      setProfile({
        ...response.data,
        _cacheBust: Date.now(),  // Unique timestamp for cache busting
      });
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

  let profileImageUrl = null;
  if (profile?.profilePictureUrl) {
    let url = profile.profilePictureUrl;
    
    // Prepend API URL only for relative paths
    if (!/^https?:\/\//i.test(url)) {
      url = `${apiUrl}${url}`;
    }
    
    // Add cache-busting timestamp parameter
    const separator = url.includes('?') ? '&' : '?';
    profileImageUrl = `${url}${separator}ts=${profile._cacheBust}`;
  }


  return (
    <div>
      {profile ? (
      <div>
        <div>
          {profile.profilePictureUrl ? (
              <img
                className="profile-picture"
                src={profileImageUrl}
                alt="Profile"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.onerror = null;
                  e.target.parentNode.replaceChild(
                    document.createTextNode('No profile image'),
                    e.target
                  );
                }}
              />
            ) : (
              <div>No profile image</div>
            )}
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
                Are you sure you want to delete  account?
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
