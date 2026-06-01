import React, { useEffect, useState } from "react";
import axios from "axios";

// ── Axios instance me JWT ──────────────────────────────────────
const api = axios.create({ baseURL: "http://localhost:8080" });

api.interceptors.request.use((config) => {
 const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.warn("Sesioni ka skaduar ose nuk keni leje.");
    }
    return Promise.reject(err);
  }
);
// ──────────────────────────────────────────────────────────────

const LOCAL_KEY = "suppliers";

const defaultSuppliers = [
  { id: 1, corporateName: "Flower Power LLC", email: "info@flowerpower.com", pointOfContact: "Elena Krasniqi", telephone: "+38344111222", address: "Rruga Nëna Terezë, Prishtinë" },
  { id: 2, corporateName: "Amelia Flora Wholesales", email: "orders@ameliaflora.nl", pointOfContact: "Jan de Jong", telephone: "+31612345678", address: "Aalsmeer Flower Market, Hollandë" },
];

const emptyForm = { corporateName: "", email: "", pointOfContact: "", telephone: "", address: "" };

const getLocal = () => {
  const stored = localStorage.getItem(LOCAL_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultSuppliers));
  return defaultSuppliers;
};
const saveLocal = (data) => localStorage.setItem(LOCAL_KEY, JSON.stringify(data));

const labelStyle = { display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" };
const inputStyle = { width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box", fontSize: "14px" };
const buttonStyle = { width: "100%", background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", fontSize: "13px" };

const SupplierCRUD = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);
  const [isOffline, setIsOffline] = useState(false);

  const API_URL = "/api/suppliers";

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(API_URL);
      setSuppliers(res.data);
      setIsOffline(false);
    } catch {
      console.warn("Backend jo aktiv. Po kalojmë në LocalStorage...");
      setSuppliers(getLocal());
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.corporateName.trim() || !formData.email.trim()) {
      setError("Emri i Kompanisë dhe Email-i janë të detyrueshme.");
      return;
    }
    const newSupplier = { id: Date.now(), ...formData };

    if (isOffline) {
      const updated = [...suppliers, newSupplier];
      saveLocal(updated);
      setSuppliers(updated);
    } else {
      try {
        const res = await api.post(API_URL, newSupplier);
        setSuppliers((prev) => [...prev, res.data]);
      } catch {
        const updated = [...suppliers, newSupplier];
        saveLocal(updated);
        setSuppliers(updated);
        setIsOffline(true);
      }
    }
    setFormData(emptyForm);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë furnitor?")) return;
    const filtered = suppliers.filter((s) => s.id !== id);

    if (isOffline) {
      saveLocal(filtered);
      setSuppliers(filtered);
      return;
    }
    try {
      await api.delete(`${API_URL}/${id}`);
      setSuppliers(filtered);
    } catch {
      saveLocal(filtered);
      setSuppliers(filtered);
      setIsOffline(true);
    }
  };

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Zinxhiri i Furnizimit</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Katalogu i Furnitorëve</h2>
          {isOffline && (
            <div style={{ marginTop: "10px", display: "inline-block", background: "#FFF4CC", color: "#7A5C00", border: "1px solid #F5D860", padding: "6px 14px", fontSize: "12px", fontWeight: "600" }}>
              ⚠ Modaliteti offline — të dhënat ruhen në LocalStorage
            </div>
          )}
        </div>

        {error && (
          <div style={{ backgroundColor: "#FFEAEA", color: "#C0392B", border: "1px solid #FFD1D1", padding: "12px", fontSize: "13px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "40px", alignItems: "start" }}>

          {/* FORMA */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
              Regjistro Furnitor të Ri (B2B)
            </h3>
            <form onSubmit={handleSubmit}>
              {[
                { label: "Emri i Kompanisë / Entitetit", field: "corporateName", type: "text", placeholder: "Psh. Flower Power LLC" },
                { label: "Adresa e Email-it", field: "email", type: "email", placeholder: "info@supplier.com" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field} style={{ marginBottom: "15px" }}>
                  <label style={labelStyle}>{label}</label>
                  <input type={type} value={formData[field]} onChange={(e) => updateField(field, e.target.value)} placeholder={placeholder} style={inputStyle} />
                </div>
              ))}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                {[
                  { label: "Pika e Kontaktit", field: "pointOfContact", placeholder: "Psh. Elena Krasniqi" },
                  { label: "Numri i Telefonit", field: "telephone", placeholder: "+383..." },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label style={labelStyle}>{label}</label>
                    <input type="text" value={formData[field]} onChange={(e) => updateField(field, e.target.value)} placeholder={placeholder} style={inputStyle} />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={labelStyle}>Adresa Fizike e Selisë</label>
                <input type="text" value={formData.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Rruga, Qyteti" style={inputStyle} />
              </div>

              <button type="submit" style={buttonStyle}>Ruaj Furnitorin</button>
            </form>
          </div>

          {/* TABELA */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke sinkronizuar katalogun...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                    {["Identiteti i Biznesit", "Komunikimi", "Përfaqësuesi & Adresa", "Veprime"].map((col, i) => (
                      <th key={col} style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: i === 3 ? "center" : "left" }}>{col}</th>
                    ))}
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
                          <span style={{ fontSize: "11px", color: "#0E5A5B", fontWeight: "600" }}>ID: #{String(sup.id).slice(-4)}</span>
                        </td>
                        <td style={{ padding: "16px 15px" }}>
                          <span style={{ display: "block" }}>{sup.email}</span>
                          <span style={{ fontSize: "12px", color: "rgba(31,31,31,0.6)" }}>{sup.telephone || "Nuk ka telefon"}</span>
                        </td>
                        <td style={{ padding: "16px 15px" }}>
                          <span style={{ display: "block", fontWeight: "600", color: "rgba(31,31,31,0.8)" }}>{sup.pointOfContact || "Nuk ka emër"}</span>
                          <span style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(31,31,31,0.6)" }}>{sup.address || "Nuk ka adresë"}</span>
                        </td>
                        <td style={{ padding: "16px 15px", textAlign: "center" }}>
                          <button onClick={() => handleDelete(sup.id)} style={{ background: "transparent", color: "#C0392B", border: "1px solid #C0392B", padding: "4px 10px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer", letterSpacing: "0.5px" }}>
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