import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

function RoleProtectedNavButton({ navTo, buttonText }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <button>Redirecting...</button>;
  }

  if (isAuthenticated) {
    return (
      <NavLink to={navTo}>
        <button>{buttonText}</button>
      </NavLink>
    );
  }
}

export default RoleProtectedNavButton;
