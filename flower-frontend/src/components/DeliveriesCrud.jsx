import React, { useEffect, useState } from "react";
import api from "../services/api.jsx";

const API_URL = "/api/deliveries";

const emptyForm = {
  porosiaId: "",
  korrieriId: "",
  dataDorezimit: "",
  oraDorezimit: "",
  statusi: "IN_TRANSIT",
  firmaPranuesit: "",
};

const DeliveriesCRUD = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(API_URL);
      setDeliveries(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gabim deliveries:", err.response?.data || err.message);
      setError("Nuk u ngarkuan dërgesat nga backend-i.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.porosiaId || !formData.korrieriId) {
      setError("ID e porosisë dhe ID e korrierit janë të detyrueshme.");
      return;
    }

    const payload = {
      porosiaId: Number(formData.porosiaId),
      korrieriId: Number(formData.korrieriId),
      dataDorezimit: formData.dataDorezimit || null,
      oraDorezimit: formData.oraDorezimit || null,
      statusi: formData.statusi,
      firmaPranuesit: formData.firmaPranuesit || "",
    };

    try {
      await api.post(API_URL, payload);
      setFormData(emptyForm);
      fetchDeliveries();
    } catch (err) {
      console.error("Gabim POST delivery:", err.response?.data || err.message);
      setError("Dërgesa nuk u ruajt. Kontrollo a ekziston porosia dhe korrieri.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je e sigurt që don me fshi këtë dërgesë?")) return;

    try {
      await api.delete(`${API_URL}/${id}`);
      setDeliveries((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Gabim DELETE delivery:", err.response?.data || err.message);
      setError("Dërgesa nuk u fshi.");
    }
  };

  const badge = (status) => {
    if (status === "DELIVERED") return { bg: "#E8F5E9", color: "#2E7D32", text: "E DORËZUAR" };
    if (status === "CANCELLED") return { bg: "#FFEBEE", color: "#C62828", text: "E ANULUAR" };
    return { bg: "#EBF3F9", color: "#1D6FA5", text: "NË RRUGË" };
  };

  return (
    <div style={{ padding: "40px 6%", fontFamily: "system-ui", backgroundColor: "#FAF8F5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: 20, marginBottom: 40 }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 32, color: "#2B1A4A", margin: 0 }}>
            Menaxhimi i Dërgesave
          </h2>
          <p style={{ color: "#777", marginTop: 8 }}>
            Dërgesat lidhen me porositë dhe korrierët/furnitorët ekzistues.
          </p>
        </div>

        {error && (
          <div style={{ background: "#FFEAEA", color: "#C62828", padding: 12, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 40 }}>
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: 30, height: "fit-content" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", marginBottom: 20, borderBottom: "2px solid #2B1A4A", paddingBottom: 8 }}>
              Cakto Dërgesë të Re
            </h3>

            <form onSubmit={handleSubmit}>
              <label style={label}>ID e Porosisë</label>
              <input
                style={input}
                type="number"
                value={formData.porosiaId}
                onChange={(e) => setFormData({ ...formData, porosiaId: e.target.value })}
                placeholder="psh. 15"
              />

              <label style={label}>ID e Korrierit / Furnitorit</label>
              <input
                style={input}
                type="number"
                value={formData.korrieriId}
                onChange={(e) => setFormData({ ...formData, korrieriId: e.target.value })}
                placeholder="psh. 2"
              />

              <label style={label}>Data e Dorëzimit</label>
              <input
                style={input}
                type="date"
                value={formData.dataDorezimit}
                onChange={(e) => setFormData({ ...formData, dataDorezimit: e.target.value })}
              />

              <label style={label}>Ora e Dorëzimit</label>
              <input
                style={input}
                type="time"
                value={formData.oraDorezimit}
                onChange={(e) => setFormData({ ...formData, oraDorezimit: e.target.value })}
              />

              <label style={label}>Statusi</label>
              <select
                style={input}
                value={formData.statusi}
                onChange={(e) => setFormData({ ...formData, statusi: e.target.value })}
              >
                <option value="IN_TRANSIT">IN_TRANSIT</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <label style={label}>Firma e Pranuesit</label>
              <input
                style={input}
                value={formData.firmaPranuesit}
                onChange={(e) => setFormData({ ...formData, firmaPranuesit: e.target.value })}
                placeholder="psh. Blenda Rama"
              />

              <button type="submit" style={button}>
                Ruaj Dërgesën
              </button>
            </form>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#777" }}>Duke u ngarkuar...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#2B1A4A", color: "#FFF", textAlign: "left" }}>
                    <th style={th}>ID</th>
                    <th style={th}>Porosia</th>
                    <th style={th}>Korrieri</th>
                    <th style={th}>Data</th>
                    <th style={th}>Ora</th>
                    <th style={th}>Statusi</th>
                    <th style={th}>Firma</th>
                    <th style={th}>Veprime</th>
                  </tr>
                </thead>

                <tbody>
                  {deliveries.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ padding: 35, textAlign: "center", color: "#777" }}>
                        Nuk ka dërgesa të regjistruara.
                      </td>
                    </tr>
                  ) : (
                    deliveries.map((d) => {
                      const s = badge(d.statusi);
                      return (
                        <tr key={d.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                          <td style={td}>#{d.id}</td>
                          <td style={td}>#{d.porosia?.id || "—"}</td>
                          <td style={td}>{d.korrieri?.emri || d.korrieri?.name || d.korrieri?.kompania || `#${d.korrieri?.id || "—"}`}</td>
                          <td style={td}>{d.dataDorezimit ? new Date(d.dataDorezimit).toLocaleDateString("sq-AL") : "—"}</td>
                          <td style={td}>{d.oraDorezimit || "—"}</td>
                          <td style={td}>
                            <span style={{ background: s.bg, color: s.color, padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                              {s.text}
                            </span>
                          </td>
                          <td style={td}>{d.firmaPranuesit || "—"}</td>
                          <td style={td}>
                            <button onClick={() => handleDelete(d.id)} style={{ color: "#C62828", border: "1px solid #C62828", background: "transparent", padding: "5px 10px", cursor: "pointer" }}>
                              Fshij
                            </button>
                          </td>
                        </tr>
                      );
                    })
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

const label = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  marginBottom: 6,
  marginTop: 12,
};

const input = {
  width: "100%",
  padding: 11,
  border: "1px solid #C4B9AF",
  marginBottom: 8,
  boxSizing: "border-box",
  background: "#FAF8F5",
};

const button = {
  width: "100%",
  background: "#0E5A5B",
  color: "#FFF",
  padding: 13,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 16,
};

const th = {
  padding: 14,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.8,
};

const td = {
  padding: 14,
  fontSize: 13,
};

export default DeliveriesCRUD;