import React, { useState, useEffect } from "react";
import axios from "axios";

const Occasions = () => {
  const [occasions, setOccasions] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  const images = [
    "/images/valentineDays.webp",
    "/images/mothersDay.avif",
    "/images/wedding.jpg",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/occasions")
      .then((res) => setOccasions(res.data))
      .catch((err) => console.error("Error fetching occasions:", err));
  }, []);

  // 🔥 discount logic
  const applyDiscount = (price, discount) => {
    if (!discount) return price;
    return price - (price * discount) / 100;
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: "32px",
          color: "#2C1A4A",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        Special Occasions
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 350px))",
          gap: "30px",
          width: "100%",
          maxWidth: "1200px",
          justifyContent: "center",
        }}
      >
        {occasions.map((o, index) => {
          const isSelected = selectedOccasion?.id === o.id;

          return (
            <div
              key={o.id}
              onClick={() => setSelectedOccasion(o)}
              style={{
                border: isSelected
                  ? "2px solid #0D5C5C"
                  : "1px solid #E6E0D8",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "center",
                cursor: "pointer",
                transition: "0.2s",
                boxShadow: isSelected
                  ? "0 6px 20px rgba(13,92,92,0.2)"
                  : "none",
              }}
            >
              {/* IMAGE */}
              <img
                src={images[index % images.length]}
                alt={o.emertimi}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "15px",
                }}
              />

              <h3 style={{ fontSize: "20px", marginTop: "10px" }}>
                {o.emertimi}
              </h3>

              <p style={{ color: "#555", fontSize: "14px" }}>
                {o.pershkrimi}
              </p>

              <p style={{ color: "#777", fontSize: "13px" }}>
                Date: {o.dataNgjarjes}
              </p>

              <p style={{ color: "#C0392B", fontWeight: "bold" }}>
                Discount: {o.zbritjaPerqindje}%
              </p>

              {isSelected && (
                <p
                  style={{
                    marginTop: "10px",
                    fontSize: "13px",
                    color: "#0D5C5C",
                    fontWeight: "600",
                  }}
                >
                  ✓ Selected (discount active)
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔥 PREVIEW ZBRITJA (OPTIONAL TEST AREA) */}
      {selectedOccasion && (
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            width: "100%",
            maxWidth: "500px",
            textAlign: "center",
          }}
        >
          <h3>Discount Preview</h3>
          <p>
            Original Price: <b>$100</b>
          </p>
          <p>
            Discount: <b>{selectedOccasion.zbritjaPerqindje}%</b>
          </p>
          <p style={{ color: "#0D5C5C", fontSize: "20px" }}>
            Final Price: $
            {applyDiscount(100, selectedOccasion.zbritjaPerqindje).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Occasions;