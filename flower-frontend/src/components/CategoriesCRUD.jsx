import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoriesCRUD = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const API_URL = "http://localhost:8080/api/categories";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setCategories(res.data);
    } catch (err) {
      console.log("Categories Backend jo aktiv. Po kalojmë në LocalStorage...");
      const localCategories = JSON.parse(localStorage.getItem("categories")) || [
        { id: 1, name: "Trëndafila të Përjetshëm", description: "Lule të përjetshme që zgjasin me vite pa u tharë." },
        { id: 2, name: "Buqeta Lulesh", description: "Arranxhime të ndryshme me lule të freskëta dhe elegante." },
        { id: 3, name: "Kuti Luksoze", description: "Lule ekskluzive të vendosura në kuti kadifeje ose druri." }
      ];
      setCategories(localCategories);
      if (!localStorage.getItem("categories")) {
        localStorage.setItem("categories", JSON.stringify(localCategories));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Emri i kategorisë është i detyrueshëm.");
      return;
    }

    const newCategory = {
      id: Date.now(),
      ...formData
    };

    try {
      const res = await axios.post(API_URL, newCategory);
      setCategories([...categories, res.data]);
    } catch (err) {
      console.log("Ruajtja në backend dështoi. Ruhet në LocalStorage...");
      const localCategories = JSON.parse(localStorage.getItem("categories")) || [];
      const updated = [...localCategories, newCategory];
      localStorage.setItem("categories", JSON.stringify(updated));
      setCategories(updated);
    }

    setFormData({ name: "", description: "" });
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë kategori?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.log("Fshirja në backend dështoi. Fshihet nga LocalStorage...");
      const updated = categories.filter(c => c.id !== id);
      localStorage.setItem("categories", JSON.stringify(updated));
      setCategories(updated);
    }
  };

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>
            Struktura e Dyqanit
          </span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
            Kategoritë e Produkteve
          </h2>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1', padding: "12px", fontSize: '13px', marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px", alignItems: "start" }}>
          
          {/* FORM - CREATE NEW CATEGORY */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
              Regjistro Kategori të Re
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Emri i Kategorisë</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Shkruaj emrin e kategorisë" 
                  style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} 
                />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Përshkrimi / Fushëveprimi</label>
                <textarea 
                  rows="4"
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Përshkruaj qëllimin ose llojet e luleve në këtë kategori..." 
                  style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", fontFamily: "inherit", resize: "none" }} 
                />
              </div>

              <button type="submit" style={{ width: "100%", background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                Ruaj Kategorinë
              </button>
            </form>
          </div>

          {/* TABLE - LIST OF CATEGORIES */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke sinkronizuar strukturën...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                    <th style={{ padding: "16px 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", width: "80px" }}>ID</th>
                    <th style={{ padding: "16px 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Emri i Kategorisë</th>
                    <th style={{ padding: "16px 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Përshkrimi</th>
                    <th style={{ padding: "16px 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", width: "100px" }}>Veprime</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                        Nuk ka asnjë kategori të regjistruar në sistem.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                        <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{cat.id.toString().slice(-4)}</td>
                        <td style={{ padding: "16px 20px", fontWeight: "600", color: "#2B1A4A" }}>{cat.name}</td>
                        <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif", fontSize: "13.5px", color: "rgba(31,31,31,0.7)" }}>{cat.description || "Nuk ka përshkrim."}</td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <button 
                            onClick={() => handleDelete(cat.id)} 
                            style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 10px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}
                          >
                            Fshij
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoriesCRUD;