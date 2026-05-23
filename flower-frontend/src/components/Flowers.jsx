import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Flowers.css';

const Flowers = () => {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/flowers')
      .then((response) => {
        setFlowers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching flowers:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Loading flowers...</div>;

  return (
    <div className="flowers-page" style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* STYLIZED TITLE */}
      <h1 style={{ 
        fontFamily: 'Georgia, serif', 
        fontStyle: 'italic', 
        fontSize: '32px', 
        color: '#2C1A4A', 
        marginBottom: '40px',
        textAlign: 'center' 
      }}>
        Our Flower Collection
      </h1>
      
      <div className="flowers-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '30px', 
        width: '100%', 
        maxWidth: '1200px' 
      }}>
        {flowers.map((flower) => (
          <div key={flower.id} className="flower-card" style={{ border: '1px solid #E6E0D8', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <img src={flower.foto} alt={flower.emertimi} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
            
            <div className="flower-info" style={{ marginTop: '15px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{flower.emertimi}</h3>
              <p style={{ margin: '4px 0', fontSize: '14px' }}><strong>Type:</strong> {flower.lloji}</p>
              <p style={{ margin: '4px 0', fontSize: '14px', color: '#555' }}><strong>Price:</strong> {flower.cmimi} €</p>
              
              {flower.sasiaStokut > 0 ? (
                <button 
                  className="buy-button" 
                  onClick={() => alert(`Added ${flower.emertimi} to cart!`)}
                  style={{ marginTop: '15px', padding: '8px 20px', backgroundColor: '#2C1A4A', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Add to Cart
                </button>
              ) : (
                <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>Out of stock</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flowers;