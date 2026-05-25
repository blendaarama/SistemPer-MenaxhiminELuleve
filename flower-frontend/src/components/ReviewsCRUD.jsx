import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewsCRUD = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Admini vetëm i merr të dhënat, nuk i shton ato (ai thjesht moderon)
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // Përpiqet të marrë nga API, nëse jo, nga localStorage
      const res = await axios.get("http://localhost:8080/api/reviews");
      setReviews(res.data);
    } catch (err) {
      const local = JSON.parse(localStorage.getItem("reviews")) || [];
      setReviews(local);
    }
  };

  const deleteReview = (id) => {
    if (window.confirm("A jeni të sigurt që dëshironi ta fshini këtë vlerësim?")) {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      localStorage.setItem("reviews", JSON.stringify(updated));
    }
  };

  return (
    <div style={{ padding: "40px 6%", fontFamily: "system-ui, sans-serif", backgroundColor: "#FAF8F5", minHeight: "100vh" }}>
      <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#2B1A4A", margin: "0" }}>Moderimi i Vlerësimeve</h2>
        <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>Paneli i kontrollit për komentet e klientëve.</p>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#FFF", border: "1px solid #E6E0D8" }}>
        <thead>
          <tr style={{ background: "#2B1A4A", color: "#FFF", textAlign: "left" }}>
            <th style={{ padding: "16px", fontSize: "11px", letterSpacing: "1px" }}>KLIENTI</th>
            <th style={{ padding: "16px", fontSize: "11px", letterSpacing: "1px" }}>VLERËSIMI</th>
            <th style={{ padding: "16px", fontSize: "11px", letterSpacing: "1px" }}>KOMENTI</th>
            <th style={{ padding: "16px", fontSize: "11px", letterSpacing: "1px" }}>VEPRIME</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
              <td style={{ padding: "16px", fontWeight: "600", fontSize: "13px" }}>ID: {r.customerId}</td>
              <td style={{ padding: "16px" }}>
                <span style={{ background: "#FFF8E1", color: "#F57F17", padding: "4px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold" }}>
                  {r.score} YJE
                </span>
              </td>
              <td style={{ padding: "16px", fontSize: "13px", color: "#555", maxWidth: "400px" }}>{r.comment}</td>
              <td style={{ padding: "16px" }}>
                <button 
                  onClick={() => deleteReview(r.id)} 
                  style={{ background: "none", border: "1px solid #C62828", color: "#C62828", padding: "4px 12px", cursor: "pointer", fontSize: "11px", textTransform: "uppercase" }}
                >
                  Fshij
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsCRUD;