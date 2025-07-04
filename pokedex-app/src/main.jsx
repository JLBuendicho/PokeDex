import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRouteContext.jsx";
import RoleProtectedRoute from "./context/RoleProtectedRouteContext.jsx";
import "./styles/index.css";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/RegisterPage.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import Dashboard from "./pages/DashboardPage.jsx";
import ManageAdmin from "./pages/ManageAdminPage.jsx";
import ProfileOutlet from "./components/ProfileOutlet.jsx";
import EditProfile from "./pages/EditProfilePage.jsx";
import RegisterAdmin from "./pages/RegisterAdminPage.jsx";
import AddPokemon from "./pages/ManagePokemonPage.jsx";
import PokeDex from "./pages/PokeDexPage.jsx";
import PokeInfo from "./pages/PokeInfoPage.jsx";
import EditPokemonPage from "./pages/EditPokemonPage.jsx";
import RegisterPokemonPage from "./pages/RegisterPokemonPage.jsx";

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
    path: "/profile/:id",
    element: (
      <ProtectedRoute>
        <ProfileOutlet />
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-profile/:id",
    element: (
      <ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/manage-admin",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin"]}>
        <ManageAdmin />
      </RoleProtectedRoute>
    ),
    children: [
      {
        path: "/manage-admin/:id",
        element: (
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <ProfileOutlet />
          </RoleProtectedRoute>
        ),
      }
    ]
  },
  {
    path: "/register-admin",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin"]}>
        <RegisterAdmin />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/manage-pokemon",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin"]}>
        <AddPokemon />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "edit-pokemon/:id",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin"]}>
        <EditPokemonPage />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/register-pokemon",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin"]}>
        <RegisterPokemonPage />
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
  {
    path: "/pokemon/:id",
    element: (
      <ProtectedRoute>
        <PokeInfo />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
