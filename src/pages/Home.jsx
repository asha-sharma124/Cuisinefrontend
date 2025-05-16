import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { FaUtensils, FaFireAlt, FaGift } from 'react-icons/fa'; // Icons imported

export default function Home() {


  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.3}s`;
      el.classList.add('show');
    });
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="overlay fade-in">
          <h1 className="title"><FaUtensils /> Welcome to Yum Yard</h1>
          <p className="subtitle">
            Delivering delicious food & festive flavors to your doorstep
          </p>
          <Link to="/login" className="cta-button">
            🍽 Start Ordering
          </Link>
        </div>
      </div>

      <div className="specials-section">
        <h2 className="section-title fade-in">
          <FaGift style={{ marginRight: "8px" }} />
          Our Specials
        </h2>
        <div className="specials-grid">
          <div className="special-card fade-in">
            <h3><FaFireAlt /> Daily Specials</h3>
            <p>
              Craving something spicy, crispy, or cheesy? Explore our daily curated menu full of local and international favorites.
            </p>
          </div>
          <div className="special-card fade-in">
            <h3><FaGift /> Festive Favorites</h3>
            <p>
              Celebrate Holi, Diwali, Eid, and more with mouthwatering traditional meals crafted with festive joy and flavor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
