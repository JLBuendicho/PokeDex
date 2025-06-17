import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState(null);

  console.log("ProfilePage params:", params);

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await axios.get(`${apiUrl}/api/users/${params.id}`);
      setProfile(response.data);
    };
    fetchProfile();
  }, [params.id]);

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
        <button>Delete Account</button>
    </div>
  );
}
export default ProfilePage;
