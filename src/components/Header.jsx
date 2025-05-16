import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./Header.css";

// React Icons
import { FaSearch, FaSignOutAlt, FaUser, FaBars, FaUtensils, FaShoppingCart, FaTruck, FaInfoCircle, FaConciergeBell } from "react-icons/fa";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, setCart, getTotalQuantity } = useCart();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    setCart([]);
    navigate("/login");
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() !== "") {
      navigate(`/dashboard?q=${encodeURIComponent(query)}`);
    } else {
      navigate("/dashboard");
    }
  };

  const totalItems = getTotalQuantity();

  return (
    <header className="navbar" data-aos="fade-down">
      <div className="navbar-container">
        <h1 className="logo" data-aos="zoom-in">
          <Link to="/">🍴 Yum Yard</Link>
        </h1>

        <nav className="nav-links" data-aos="fade-up">
          {isLoggedIn && (
            <div className="search-container" data-aos="fade-right">
              
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((item, index) => (
                    <Link key={index} to={`/item/${item.name}`} className="search-item">
                      <img src={item.image} alt={item.name} />
                      <div className="search-item-details">
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link" data-aos="fade-up">
                <FaUser /> Dashboard
              </Link>
              <Link to="/categories" className="nav-link" data-aos="fade-up">
                <FaUtensils /> Categories
              </Link>
              <Link to="/cart" className="nav-link" data-aos="fade-up">
                <FaShoppingCart /> <span className="cart-count">{totalItems}</span>
              </Link>

             
              <Link to="/track-order" className="nav-link" data-aos="fade-up">
                <FaTruck /> Track Order
              </Link>
              <div
                className="dropdown"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
                data-aos="fade-left"
              >
                <Link to="#" className="nav-link"><FaBars /> More</Link>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/service" className="dropdown-item"><FaConciergeBell /> Service</Link>
                    <Link to="/about" className="dropdown-item"><FaInfoCircle /> About Us</Link>
                    <Link to="/vendor" className="dropdown-item">Vendor Register</Link>
                  </div>
                )}
              </div>
              <button className="logout-btn" onClick={handleLogout} data-aos="zoom-in">
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link" data-aos="fade-up">
                <FaUser /> Home
              </Link>
              <Link to="/login" className="nav-link" data-aos="fade-up">
                <FaUser /> Login
              </Link>
              <div
                className="dropdown"
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
                data-aos="fade-left"
              >
                <Link to="#" className="nav-link"><FaBars /> More</Link>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/service" className="dropdown-item"><FaConciergeBell /> Service</Link>
                    <Link to="/about" className="dropdown-item"><FaInfoCircle /> About Us</Link>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
