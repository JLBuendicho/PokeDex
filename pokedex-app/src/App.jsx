import { useState } from "react"; // Import core React functionality
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import routing components from React Router
import "./App.css"; // Stylesheet for the application
import Login from "./pages/LoginPage.jsx"; // Your page components

// Pokémon form components
import RegisterPokemonForm from "./pokemon/RegisterPokemonForm.jsx";
import EditPokemonForm from "./pokemon/EditPokemonForm.jsx";

// Main application component
function App() {
  const [count, setCount] = useState(0); // State example (you can remove this if unused)

  return (
    // Wrap the app in a Router to enable client-side navigation
    <Router>
      {/* Define all routes here */}
      <Routes>
        {/* Root path - shows Login page */}
        <Route path="/" element={<Login />} />

        {/* Register Pokémon form path */}
        <Route path="/register" element={<RegisterPokemonForm />} />

        {/* Edit Pokémon form path, uses URL parameter 'id' */}
        <Route path="/edit/:id" element={<EditPokemonForm />} />

        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
}

// Export the App component so it can be rendered
export default App;
