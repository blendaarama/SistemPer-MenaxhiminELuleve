import React, { useEffect, useState } from "react";

const ReviewsCRUD = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Lexojmë direkt nga localStorage
    const loadReviews = () => {
      const saved = localStorage.getItem("reviews");
      if (saved) {
        setReviews(JSON.parse(saved));
      }
    };
    loadReviews();
  }, []);

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
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#FFF", border: "1px solid #E6E0D8" }}>
        <thead>
          <tr style={{ background: "#2B1A4A", color: "#FFF", textAlign: "left" }}>
            <th style={{ padding: "16px" }}>KLIENTI</th>
            <th style={{ padding: "16px" }}>VLERËSIMI</th>
            <th style={{ padding: "16px" }}>KOMENTI</th>
            <th style={{ padding: "16px" }}>VEPRIME</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                <td style={{ padding: "16px", fontWeight: "600" }}>{r.customerId}</td>
                <td style={{ padding: "16px" }}>
                  <span style={{ background: "#FFF8E1", color: "#F57F17", padding: "4px 8px", borderRadius: "12px", fontSize: "10px", fontWeight: "bold" }}>
                    {r.score} YJE
                  </span>
                </td>
                <td style={{ padding: "16px", fontSize: "13px" }}>{r.comment}</td>
                <td style={{ padding: "16px" }}>
                  <button onClick={() => deleteReview(r.id)} style={{ background: "#C62828", color: "#FFF", border: "none", padding: "6px 12px", cursor: "pointer" }}>Fshij</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>Nuk ka vlerësime për momentin.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsCRUD;