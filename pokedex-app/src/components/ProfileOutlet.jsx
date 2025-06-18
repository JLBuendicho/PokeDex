import { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import axios from "axios";
import ProtectedNavButton from "./ProtectedNavButton.jsx";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function ProfilePage() {
  const {isOutlet = false} = useOutletContext() || {};
  const [profile, setProfile] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(`${apiUrl}/api/users/${userId}`);
      setProfile(response.data);
    };
    fetchProfile();
  }, [userId]);

  console.log("Profile data:", profile);

  return (
    <div>
        {profile ? (
          <div>
            <img className="profile-picture" src={profile.profilePictureUrl} alt="Profile" />
            <div>
              <p>Username: {profile.username}</p>
              <p>Email: {profile.email}</p>
              <p>Role: {profile.role}</p>
            </div>
          </div>
        ) : (
          <p>Loading profile...</p>
        )
        }
        <div className="button-container">
          <button>Delete Account</button>
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
            )
          }
        </div>
    </div>
  );
}
export default ProfilePage;
