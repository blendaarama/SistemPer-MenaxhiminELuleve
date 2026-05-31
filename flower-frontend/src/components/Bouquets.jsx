import React, { useState, useEffect } from "react";
import axios from "axios";

const Bouquets = () => {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchBouquets();
  }, []);

  const fetchBouquets = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get("http://localhost:8080/api/bouquets", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setBouquets(res.data);
    } catch (err) {
      console.error("Error fetching bouquets:", err);
      setError("Nuk u ngarkuan buqetat.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        Loading bouquets...
      </div>
    );
  }

  return (
    <div style={{
      padding: "40px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      
      <h1 style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: "32px",
        color: "#2C1A4A",
        marginBottom: "20px"
      }}>
        Our Bouquet Selection
      </h1>

      {error && (
        <div style={{
          color: "red",
          marginBottom: "20px"
        }}>
          {error}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "30px",
        width: "100%",
        maxWidth: "1200px"
      }}>
        
        {bouquets.map((b) => (
          <div
            key={b.id}
            style={{
              border: "1px solid #E6E0D8",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center"
            }}
          >
            <img
              src={b.foto || "https://via.placeholder.com/300"}
              alt={b.emertimi}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "4px"
              }}
            />

            <h3 style={{ fontSize: "20px", marginTop: "15px" }}>
              {b.emertimi}
            </h3>

            <p style={{
              color: "#666",
              fontSize: "14px",
              marginBottom: "5px"
            }}>
              {b.pershkrimi}
            </p>

            <p style={{
              color: "#555",
              fontWeight: "bold"
            }}>
              Madhësia: {b.madhesia}
            </p>

            {/* backend field korrekt */}
            <p style={{
              color: "#777",
              fontSize: "13px"
            }}>
              {b.emratELuleve?.length
                ? b.emratELuleve.join(", ")
                : "Pa lule të lidhura"}
            </p>

            <p style={{
              color: "#2C1A4A",
              fontSize: "18px",
              margin: "10px 0"
            }}>
              {b.cmimi} €
            </p>

            <button
              onClick={() => alert(`Added ${b.emertimi} to cart!`)}
              style={{
                padding: "10px 25px",
                backgroundColor: "#2C1A4A",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Bouquets;