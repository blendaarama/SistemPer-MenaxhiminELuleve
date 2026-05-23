import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Occasions = () => {
  const [occasions, setOccasions] = useState([]);
  
  const images = [
    '/images/valentineDays.webp',
    '/images/mothersDay.avif',
    '/images/grandOpening.jpg',
    '/images/wedding.jpg'
  ];

  useEffect(() => {
    axios.get('http://localhost:8080/api/occasions')
      .then((res) => setOccasions(res.data))
      .catch((err) => console.error("Error fetching occasions:", err));
  }, []);

  return (
    <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Titulli i stilizuar */}
      <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '32px', color: '#2C1A4A', marginBottom: '40px', textAlign: 'center' }}>
        Special Occasions
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 350px))', gap: '30px', width: '100%', maxWidth: '1200px', justifyContent: 'center' }}>
        {occasions.map((o, index) => (
          <div key={o.id} style={{ border: '1px solid #E6E0D8', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            {/* Foto dinamike */}
            <img 
              src={images[index % images.length]} 
              alt={o.emertimi} 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px', marginBottom: '15px' }} 
            />
            
            <h3 style={{ fontSize: '20px', marginTop: '10px' }}>{o.emertimi}</h3>
            <p style={{ color: '#555', fontSize: '14px' }}>{o.pershkrimi}</p>
            <p style={{ color: '#777', fontSize: '13px' }}>Date: {o.dataNgjarjes}</p>
            <p style={{ color: '#d9534f', fontWeight: 'bold' }}>Discount: {o.zbritjaPerqindje}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Occasions;