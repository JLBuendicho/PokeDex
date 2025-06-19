import { useAuth } from "./AuthContext"
import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
  const { isLoading } = useAuth()
  const token = localStorage.getItem("token")

  if (isLoading) return <div>Loading...</div>
  if (!token) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute
