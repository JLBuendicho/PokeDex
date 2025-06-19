import { useAuth } from "./AuthContext"
import { Navigate } from "react-router-dom"

function RoleProtectedRoute({ children, allowedRoles }) {
  const { isLoading, user } = useAuth()
  const token = localStorage.getItem("token")

  if (isLoading) return <div>Loading...</div>
  if (!token) return <Navigate to="/" replace />
  if (!allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />

  return children
}

export default RoleProtectedRoute