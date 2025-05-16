import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import '../styles/AboutUs.css';
import image from "../images/my_image_new.jpg";

function AboutUs() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="about-us-container">
      <header className="about-header" data-aos="fade-down">
        <h1 className="about-title">About Us</h1>
        <p className="about-subtitle">The Heart of Yum Yard</p>
      </header>

      <section className="about-content">
        <div className="about-description" data-aos="fade-right">
          <h2>Our Mission</h2>
          <p>
            At Yum Yard, we aim to bring delicious food right to your doorstep. Our mission is to ensure every customer enjoys a delightful food experience with high-quality meals and fast delivery, all through a user-friendly platform.
          </p>
        </div>

        <div className="about-team" data-aos="fade-left">
          <h2>About The Creator</h2>
          <div className="team-member" data-aos="zoom-in">
            <img 
              src={image} 
              alt="Asha" 
              className="team-img" 
            />
            <h3>Asha</h3>
            <p>Creator & Developer</p>
            <p>
              Asha, the creator of Yum Yard, is dedicated to providing customers with an easy-to-use, seamless food delivery experience. Her passion for technology and food came together to create this platform that brings quality meals right to your doorstep.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
