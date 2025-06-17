import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

function RoleProtectedNavButton({ navTo, buttonText, allowedRoles }) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <button>Redirecting...</button>;
  }

  if (allowedRoles.includes(user?.role)) {
    return (
      <NavLink to={navTo}>
        <button>{buttonText}</button>
      </NavLink>
    );
  }
}

export default RoleProtectedNavButton;
