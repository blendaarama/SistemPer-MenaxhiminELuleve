import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Bouquets = () => {
  const [bouquets, setBouquets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { addToCart } = useCart();
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

  const handleAddToCart = (b) => {
    addToCart({
      id: b.id,
      name: b.emertimi,
      price: b.cmimi,
      image: b.foto
    });

    setMessage(`${b.emertimi} u shtua në cart!`);

    setTimeout(() => {
      setMessage("");
    }, 2000);
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

      {/* MESSAGE / TOAST */}
      {message && (
        <div style={{
          backgroundColor: "#2C1A4A",
          color: "white",
          padding: "10px 20px",
          borderRadius: "6px",
          marginBottom: "20px"
        }}>
          {message}
        </div>
      )}

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
              onClick={() => handleAddToCart(b)}
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