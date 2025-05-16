import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaUser, FaLock } from "react-icons/fa";
import "../styles/Register.css";

function Register() {
 const apiUrl = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    setError(""); // Reset error on new submission
    setLoading(true); // Set loading state

    try {
      const response = await axios.post(`${apiUrl}/api/users/register/`, form);

      if (response && response.data) {
        const { id, email, username } = response.data;
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("userId", id);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);

      
        navigate("/dashboard");
      } else {
        alert("Registration failed: Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false); // Reset loading state after the request
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="form-title">Create Your Account</h2>
      <p className="form-description">
        Join our platform and start enjoying exclusive features. It's free and easy to get started!
      </p>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="input-group">
        <FaEnvelope className="input-icon" />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="input-group">
        <FaUser className="input-icon" />
        <input
          type="text"
          name="username"
          placeholder="Choose a username"
          value={form.username}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="input-group">
        <FaLock className="input-icon" />
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <button
        className="auth-button"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>

      <div className="form-footer">
        <p>
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="footer-link">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
