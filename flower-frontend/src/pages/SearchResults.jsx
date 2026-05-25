import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
        setResults(response.data);
      } catch (error) {
        console.error("Gabim gjatë kërkimit:", error);
      }
    };
    if (query) fetchResults();
  }, [query]);

  return (
    <div style={{ padding: "50px" }}>
      <h2>Rezultatet për: "{query}"</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {results.map(product => (
          <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%" }} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults; // KJO DUHET TË JETË RRESHTI I FUNDIT