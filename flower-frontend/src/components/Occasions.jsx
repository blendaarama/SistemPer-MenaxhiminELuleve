import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Occasions = () => {
  const [occasions, setOccasions] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState(null);

  const { setActiveOccasion } = useCart();

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

  const isOccasionActive = (o) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const name = o.emertimi?.toLowerCase();

    if (name?.includes("wedding")) return true;

    if (!o.dataNgjarjes) return false;

    return todayStr === o.dataNgjarjes;
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
              onClick={() => {
                if (isOccasionActive(o)) {
                  setSelectedOccasion(o);
                  setActiveOccasion(o);
                } else {
                  alert("Ky occasion nuk është aktiv sot!");
                }
              }}
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
                opacity: isOccasionActive(o) ? 1 : 0.6,
              }}
            >
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

              <h3>{o.emertimi}</h3>

              <p style={{ color: "#555", fontSize: "14px" }}>
                {o.pershkrimi}
              </p>

              <p style={{ color: "#777", fontSize: "13px" }}>
                Date: {o.dataNgjarjes || "Always active"}
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
    </div>
  );
};

export default Occasions;