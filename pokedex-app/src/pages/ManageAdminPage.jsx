import { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function ManageAdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get(`${apiUrl}/api/users`);
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  console.log(users);

  return (
    <ul>
      {users
        .filter((user) => user.role === "admin")
        .map((user) => (
          <li key={user.id}>
            {user.username} - {user.role}
          </li>
        ))}
    </ul>
  );
}

export default ManageAdminPage;
