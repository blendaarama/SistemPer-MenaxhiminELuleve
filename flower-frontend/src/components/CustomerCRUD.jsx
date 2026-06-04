import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerCRUD = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    telefoni: "",
    adresa: "",
    isVip: false
  });

  const API_URL = "http://localhost:8080/api/customers";

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setCustomers(res.data);
    } catch (err) {
      console.log("Customer Backend jo aktiv. Po kalojmë në LocalStorage...");
      const localCustomers = JSON.parse(localStorage.getItem("customers")) || [];
      setCustomers(localCustomers);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emri || !formData.email) {
      setError("Emri dhe Email-i janë të detyrueshëm.");
      return;
    }

  const newCustomer = {
    emri: formData.emri,
    mbiemri: formData.mbiemri,
    email: formData.email,
    telefoni: formData.telefoni,
    adresa: formData.adresa
  };

    try {
      const res = await axios.post(API_URL, newCustomer);
      setCustomers([...customers, res.data]);
    } catch (err) {
      console.log("Ruajtja në backend dështoi. Po ruhet në LocalStorage...");
      
      const localCustomers = JSON.parse(localStorage.getItem("customers")) || [];
      const updated = [...localCustomers, newCustomer];
      localStorage.setItem("customers", JSON.stringify(updated));
      setCustomers(updated);
    }

    setFormData({ emri: "", mbiemri: "", email: "", telefoni: "", adresa: "", isVip: false });
    setError("");
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë klient?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      console.log("Fshirja në backend dështoi. Po fshihet nga LocalStorage...");
      const updated = customers.filter(c => c.id !== id);
      localStorage.setItem("customers", JSON.stringify(updated));
      setCustomers(updated);
    }
  };

  const vipCount = customers.filter(c => c.isVip).length;

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>CRM Accounts</span>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Customer Management</h2>
          </div>
          <div style={{ background: "#0E5A5B", color: "#FFF", padding: "10px 16px", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
            VIP Privileges Signed: {vipCount}
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1', padding: "12px", fontSize: '13px', marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "40px", alignItems: "start" }}>
          
          {/* FORM - ENROLL NEW CUSTOMER */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
              Enroll New Customer Profile
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Emri (First Name)</label>
                <input type="text" value={formData.emri} onChange={(e) => setFormData({...formData, emri: e.target.value})} placeholder="e.g. Elena" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Mbiemri (Last Name)</label>
                <input type="text" value={formData.mbiemri} onChange={(e) => setFormData({...formData, mbiemri: e.target.value})} placeholder="e.g. Krasniqi" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Email Address</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="client@domain.com" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Telefoni</label>
                <input type="text" value={formData.telefoni} onChange={(e) => setFormData({...formData, telefoni: e.target.value})} placeholder="Contact number" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Adresa (Billing/Shipping)</label>
                <input type="text" value={formData.adresa} onChange={(e) => setFormData({...formData, adresa: e.target.value})} placeholder="Street name, City" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <div style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" id="vip" checked={formData.isVip} onChange={(e) => setFormData({...formData, isVip: e.target.checked})} style={{ width: "16px", height: "16px", accentColor: "#0E5A5B" }} />
                <label htmlFor="vip" style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", cursor: "pointer" }}>Assign Premium VIP Classification</label>
              </div>

              <button type="submit" style={{ width: "100%", background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                Save Profile
              </button>
            </form>
          </div>

          {/* TABLE - CUSTOMERS MATRIX */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke ngarkuar...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                    <th style={{ padding: "16px 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Klienti</th>
                    <th style={{ padding: "16px 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Kontakti & Email</th>
                    <th style={{ padding: "16px 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Adresa</th>
                    <th style={{ padding: "16px 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Klasifikimi</th>
                    <th style={{ padding: "16px 20px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>Veprime</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                        Nuk ka asnjë klient të regjistruar në sistem.
                      </td>
                    </tr>
                  ) : (
                    customers.map((c) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                        <td style={{ padding: "16px 20px", fontWeight: "600", color: "#2B1A4A" }}>{c.emri} {c.mbiemri}</td>
                        <td style={{ padding: "16px 20px" }}>
                          <div>{c.email}</div>
                          <div style={{ fontSize: "12px", color: "rgba(31,31,31,0.5)" }}>{c.telefoni || "S'ka telefon"}</div>
                        </td>
                        <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif", fontSize: "13px" }}>{c.adresa || "Pa adresë"}</td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{
                            fontSize: "10px", fontWeight: "700", padding: "4px 8px", textTransform: "uppercase",
                            background: c.isVip ? "#E8F5E9" : "#F5F5F5",
                            color: c.isVip ? "#2E7D32" : "#616161",
                            border: c.isVip ? "1px solid #C8E6C9" : "1px solid #E0E0E0"
                          }}>
                            {c.isVip ? "VIP Premium" : "Standard"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                          <button onClick={() => handleDelete(c.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 10px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>
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

export default CustomerCRUD;