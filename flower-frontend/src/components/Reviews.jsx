import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/reviews')
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Loading reviews...</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4" style={{ fontFamily: 'Georgia, serif', color: '#110D1A', textAlign: 'center' }}>Customer Reviews</h2>
      
      {reviews.length === 0 ? (
        <p className="text-center">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="card mb-3" style={{ border: '1px solid #E6E0D8' }}>
            <div className="card-body">
              <h5 className="card-title" style={{ fontSize: '16px', fontWeight: '600' }}>
                {review.klienti ? review.klienti.emri : "Anonymous Customer"}
              </h5>
              <p className="card-text" style={{ color: '#555', fontSize: '14px' }}>
                "{review.komenti}"
              </p>
              <div style={{ color: '#A08040', fontSize: '12px', fontWeight: 'bold' }}>
                Rating: {review.vleresimi} / 5
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Reviews;