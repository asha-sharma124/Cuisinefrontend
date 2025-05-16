import React, { useEffect } from "react";
import "../styles/Service.css";
import fastImage from "../images/fast.jpg";
import quality from "../images/qaulity.jpg";
import user from "../images/user.png";
import AOS from "aos";
import "aos/dist/aos.css";

function Service() {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
  }, []);

  return (
    <div className="service-page" data-aos="fade-in">
      <header className="service-header" data-aos="fade-down">
        <h1 className="service-title">Our Services</h1>
        <p className="service-subtitle">Quality food delivery at your doorstep</p>
      </header>

      <section className="service-info">
        <div className="service-card" data-aos="fade-right" data-aos-delay="100">
          <img
            src={fastImage}
            alt="Fast Delivery"
            className="service-img"
          />
          <div className="service-details">
            <h2>Fast Delivery</h2>
            <p>
              We ensure your food reaches you quickly and in the best condition. Enjoy fast and reliable delivery at your convenience.
            </p>
          </div>
        </div>

        <div className="service-card" data-aos="fade-left" data-aos-delay="200">
          <img
            src={quality}
            alt="Quality Food"
            className="service-img"
          />
          <div className="service-details">
            <h2>Quality Food</h2>
            <p>
              We partner with the best local restaurants to provide top-quality meals, ensuring that every bite is delicious.
            </p>
          </div>
        </div>

        <div className="service-card" data-aos="fade-up" data-aos-delay="300">
          <img
            src={user}
            alt="User-Friendly App"
            className="service-img"
          />
          <div className="service-details">
            <h2>User-Friendly App</h2>
            <p>
              Our app is designed to make your ordering experience seamless and enjoyable, with simple navigation and quick checkout.
            </p>
          </div>
        </div>
      </section>

      <footer className="service-footer" data-aos="fade-up" data-aos-delay="400">
        <p>Thank you for choosing Yum Yard!</p>
      </footer>
    </div>
  );
}

export default Service;
