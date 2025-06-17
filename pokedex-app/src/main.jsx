import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRouteContext.jsx";
import RoleProtectedRoute from "./context/RoleProtectedRouteContext.jsx";
import "./index.css";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import Dashboard from "./pages/DashboardPage.jsx";
import AddPokemon from "./pages/AddPokemonPage.jsx";
import PokeDex from "./pages/PokeDexPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage-admin",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin"]}>
        <Dashboard />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/add-pokemon",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin"]}>
        <AddPokemon />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/pokedex",
    element: (
      <ProtectedRoute>
        <PokeDex />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
