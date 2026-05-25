import React, { useEffect, useState } from "react";
import axios from "axios";

const SupplierCRUD = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Shteti për formën e regjistrimit të furnitorit
  const [formData, setFormData] = useState({
    corporateName: "",
    email: "",
    pointOfContact: "",
    telephone: "",
    address: ""
  });

  const API_URL = "http://localhost:8080/api/suppliers";

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // 1. Leximi i furnitorëve (Backend -> LocalStorage)
  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setSuppliers(res.data);
    } catch (err) {
      console.log("Supplier Backend jo aktiv. Po kalojmë në LocalStorage...");
      const localSuppliers = JSON.parse(localStorage.getItem("suppliers")) || [
        { id: 1, corporateName: "Flower Power LLC", email: "info@flowerpower.com", pointOfContact: "Elena Krasniqi", telephone: "+38344111222", address: "Rruga Nëna Terezë, Prishtinë" },
        { id: 2, corporateName: "Amelia Flora Wholesales", email: "orders@ameliaflora.nl", pointOfContact: "Jan de Jong", telephone: "+31612345678", address: "Aalsmeer Flower Market, Hollandë" }
      ];
      setSuppliers(localSuppliers);
      if (!localStorage.getItem("suppliers")) {
        localStorage.setItem("suppliers", JSON.stringify(localSuppliers));
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Regjistrimi i një furnitori të ri
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.corporateName || !formData.email) {
      setError("Emri i Kompanisë dhe Email-i janë të detyrueshme.");
      return;
    }

    const newSupplier = {
      id: Date.now(),
      ...formData
    };

    try {
      const res = await axios.post(API_URL, newSupplier);
      setSuppliers([...suppliers, res.data]);
    } catch (err) {
      console.log("Ruajtja në backend dështoi. Ruhet në LocalStorage...");
      const localSuppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
      const updated = [...localSuppliers, newSupplier];
      localStorage.setItem("suppliers", JSON.stringify(updated));
      setSuppliers(updated);
    }

    // Reseto formën
    setFormData({ corporateName: "", email: "", pointOfContact: "", telephone: "", address: "" });
    setError("");
  };

  // 3. Fshirja e një furnitori
  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë furnitor nga katalogu?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch (err) {
      console.log("Fshirja në backend dështoi. Fshihet nga LocalStorage...");
      const updated = suppliers.filter(s => s.id !== id);
      localStorage.setItem("suppliers", JSON.stringify(updated));
      setSuppliers(updated);
    }
  };

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Zinxhiri i Furnizimit</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Katalogu i Furnitorëve</h2>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1', padding: "12px", fontSize: '13px', marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "40px", alignItems: "start" }}>
          
          {/* FORM - REGISTER NEW SUPPLIER */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
              Regjistro Furnitor të Ri (B2B)
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Emri i Kompanisë / Entitetit</label>
                <input type="text" value={formData.corporateName} onChange={(e) => setFormData({...formData, corporateName: e.target.value})} placeholder="Psh. Flower Power LLC" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Adresa e Email-it</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="info@supplier.com" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Pika e Kontaktit (Emri)</label>
                  <input type="text" value={formData.pointOfContact} onChange={(e) => setFormData({...formData, pointOfContact: e.target.value})} placeholder="Psh. Elena Krasniqi" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Numri i Telefonit</label>
                  <input type="text" value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} placeholder="+383..." style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
                </div>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Adresa Fizike e Selisë</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Rruga, Qyteti" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <button type="submit" style={{ width: "100%", background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                Ruaj Furnitorin
              </button>
            </form>
          </div>

          {/* TABLE - SUPPLIER DIRECTORY */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke sinkronizuar katalogun...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Identiteti i Biznesit</th>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Komunikimi</th>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Përfaqësuesi & Adresa</th>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>Veprime</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                        Nuk ka asnjë furnitor të regjistruar në sistem.
                      </td>
                    </tr>
                  ) : (
                    suppliers.map((sup) => (
                      <tr key={sup.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                        <td style={{ padding: "16px 15px" }}>
                          <span style={{ display: "block", fontWeight: "600", color: "#2B1A4A" }}>{sup.corporateName}</span>
                          <span style={{ fontSize: "11px", color: "#0E5A5B", fontWeight: "600" }}>ID: #{sup.id.toString().slice(-4)}</span>
                        </td>
                        <td style={{ padding: "16px 15px" }}>
                          <span style={{ display: "block", color: "#1F1F1F" }}>{sup.email}</span>
                          <span style={{ fontSize: "12px", color: "rgba(31,31,31,0.6)" }}>{sup.telephone || "Nuk ka telefon"}</span>
                        </td>
                        <td style={{ padding: "16px 15px" }}>
                          <span style={{ display: "block", fontWeight: "600", color: "rgba(31,31,31,0.8)" }}>{sup.pointOfContact || "Nuk ka emër"}</span>
                          <span style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(31,31,31,0.6)" }}>{sup.address || "Nuk ka adresë"}</span>
                        </td>
                        <td style={{ padding: "16px 15px", textAlign: "center" }}>
                          <button onClick={() => handleDelete(sup.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 8px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>
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

export default SupplierCRUD;