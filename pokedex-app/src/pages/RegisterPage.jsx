import { useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "../styles/AuthPage.css";
import pokeLogo from "/poke.svg";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePictureUrl: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
    setSuccess("");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/register`,
        {
          username: form.username,
          email: form.email,
          password: form.password,
          profilePictureUrl: form.profilePictureUrl || undefined,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess(
        `${response.data.user.role}, ${response.data.user.username}, successfully made! You can now log in.`
      );
      setForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        profilePictureUrl: "",
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-header">
        <img className="poke-logo" src={pokeLogo} alt="PokeLogo" />
      </div>
      <div className="auth-container">
        <h2>Register</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="auth-link">
          Already registered? <NavLink to="/">Login here</NavLink>.
        </p>
      </div>
    </>
  );
}

export default Register;
