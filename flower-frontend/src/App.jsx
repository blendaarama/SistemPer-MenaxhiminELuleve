import React, { useEffect, useState } from "react";
import axios from "axios";

function Flowers() {
  const [flowers, setFlowers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/bouquets")
      .then((res) => {
        setFlowers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching flowers:", err);
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🌸 Flowers List</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {flowers.map((flower) => (
          <div
            key={flower.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
              borderRadius: "10px",
            }}
          >
            <img
              src={flower.foto}
              alt={flower.emertimi}
              style={{ width: "100%", height: "120px", objectFit: "cover" }}
            />

            <h3>{flower.emertimi}</h3>
            <p>{flower.pershkrimi}</p>
            <strong>€{flower.cmimi}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Flowers;