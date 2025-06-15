import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext();
const apiUrl = import.meta.env.VITE_API_BASE_URL;

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = useCallback(
    async (overrideToken) => {
      const tokenToUse = overrideToken || token;
      try {
        const response = await axios.post(
          `${apiUrl}/api/auth/validate`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenToUse}`,
            },
          }
        );
        const data = response.data;
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        console.log("ValidateToken response data:", data);
      } catch (error) {
        console.error("Token validation error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  async function login(username, password) {
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = await response.data;
      const token = data.token;

      localStorage.setItem("token", token);
      setToken(token);

      await validateToken(token);

      console.log("Login response data:", data);

      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Login failed" };
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
    validateToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
