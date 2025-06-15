import { useAuth } from "./AuthContext"
import { Navigate } from "react-router-dom"

function RoleProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/" replace />
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />

  return children
}

export default RoleProtectedRoute