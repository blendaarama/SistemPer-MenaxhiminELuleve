import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="about-page">
      {/* Navbar */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 40px', background: '#0E5A5B', color: 'white' 
      }}>
        <div className="nav-left">
          <Link to="/" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Home</Link>
          <Link to="/user/flowers" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Flowers</Link>
          <Link to="/about" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>About</Link>
        </div>

        {/* Emri i dyqanit në Italic */}
        <div className="brand" style={{ color: "white",
            fontSize: "1.6rem",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            fontFamily: "Georgia, serif" }}>
          About Us
        </div>

        <div className="nav-right">
          <Link to="/user/bouquets" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Bouquets</Link>
          <Link to="/user/occasions" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>Occasions</Link>
          <Link to="/user/reviews" style={{ color: 'white', textDecoration: 'none' }}>Reviews</Link>
        </div>
      </nav>

      {/* Who We Are Section */}
      <section style={{ display: 'flex', padding: '50px', alignItems: 'center', gap: '40px' }}>
        <div className="text-content" style={{ flex: 1, background: '#fff5f7', padding: '30px', borderRadius: '15px' }}>
          <h2 style={{ color: '#0E5A5B' }}>Who We Are</h2>
          <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#444' }}>
            Mirë se vini në <strong>Eternal Rose</strong>, destinacioni juaj kryesor për lule të freskëta dhe aranzhime unike. 
            Ne besojmë se çdo buqetë tregon një histori, prandaj jemi të përkushtuar të sjellim elegancë dhe gëzim në momentet më të rëndësishme të jetës suaj. 
            Me një përvojë të pasur në artin e luleve, ekipi ynë punon me pasion për të garantuar që çdo detaj të jetë i përsosur, 
            duke shndërruar natyrën në dhurata të paharrueshme për më të dashurit tuaj.
          </p>
        </div>
        <div className="image-content" style={{ flex: 1 }}>
          <img 
            src="/images/flowershop.webp" 
            alt="Eternal Rose Shop" 
            style={{ width: '100%', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} 
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;