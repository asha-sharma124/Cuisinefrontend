import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";  // Import AOS
import "aos/dist/aos.css";  // Import AOS CSS
import "../styles/login.css"; // External CSS

function Login() {
 const apiUrl = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init(); // Initialize AOS on component mount
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/users/login/`, form);

      if (response && response.data) {
        const { access, refresh, userId, email, username } = response.data;

        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);

        // alert("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.detail || "An error occurred"));
    }
  };

  return (
    <div className="login-page">
      <div
        className="login-info"
        data-aos="fade-right" // Add AOS animation to the info section
        data-aos-duration="1000"
      >
        <h1 className="app-title">🍴 Welcome to Yum Yard</h1>
        <p className="app-description">
          Yum Yard is your one-stop platform for discovering and ordering delicious food from local kitchens, cloud kitchens, and festival-themed menus. 
          Whether you’re craving spicy street food or comforting home-cooked meals, we’ve got something tasty for everyone. <br /><br />
          🚚 Track your orders in real time<br />
          🛒 Save your favorites to cart<br />
          🎉 Celebrate festivals with special menus<br />
          💬 And much more!
        </p>
      </div>

      <div
        className="login-container"
        data-aos="fade-up" // Add AOS animation to the login container
        data-aos-duration="1000"
      >
        <h2 className="login-title">Welcome Back 👋</h2>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="login-input"
          onChange={handleChange}
          data-aos="fade-up" // Add AOS animation to the email input
          data-aos-duration="1000"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="login-input"
          onChange={handleChange}
          data-aos="fade-up" // Add AOS animation to the password input
          data-aos-duration="1200"
        />
        <button
          onClick={handleLogin}
          className="login-button"
          data-aos="zoom-in" // Add AOS animation to the login button
          data-aos-duration="1500"
        >
          Login
        </button>

        <div className="register-column">
          <p className="register-text">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="register-link"
              data-aos="fade-up" // Add AOS animation to the register link
              data-aos-duration="1500"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
