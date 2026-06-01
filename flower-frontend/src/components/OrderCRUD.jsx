import React, { useEffect, useState } from "react";
import axios from "axios";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` }
});

const API_URL = "http://localhost:8080/api/porosi";

const STATUS_OPTIONS = ["PRITJE", "PROCESSING", "SHIPPED", "KRYER", "REFUZUAR"];

const STATUS_STYLE = {
  KRYER:      { background: "#E8F5F1", color: "#0E5A5B" },
  SHIPPED:    { background: "#E8F0FF", color: "#2B3A8A" },
  PROCESSING: { background: "#FFF4D4", color: "#B07D00" },
  PRITJE:     { background: "#FFF4D4", color: "#B07D00" },
  REFUZUAR:   { background: "#FFEAEA", color: "#C0392B" }
};

const OrderCRUD = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await axios.get(API_URL, authHeaders());
      const data = Array.isArray(res.data) ? res.data : (res.data?.content ?? []);
      setOrders(data);
      localStorage.setItem("orders", JSON.stringify(data));
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        setError("403 — Nuk keni të drejtë aksesi. Sigurohuni që jeni kyçur si ADMIN.");
      } else if (status === 401) {
        setError("401 — Token-i ka skaduar. Kyçuni sërish.");
      } else {
        const local = JSON.parse(localStorage.getItem("orders") || "[]");
        if (local.length > 0) {
          setOrders(local);
          setError("⚠️ Po shfaqen të dhëna lokale — serveri nuk u arrit.");
        } else {
          setError("Serveri nuk u arrit dhe nuk ka të dhëna lokale.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, statusi: newStatus } : o));
    try {
      await axios.put(`${API_URL}/${orderId}`, { statusi: newStatus }, authHeaders());
      // Persist to local as well
      const local = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify(local.map(o => o.id === orderId ? { ...o, statusi: newStatus } : o)));
    } catch {
      setError("Statusi nuk u ruajt në server.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë porosi?")) return;
    setOrders(prev => prev.filter(o => o.id !== id));
    try {
      await axios.delete(`${API_URL}/${id}`, authHeaders());
      const local = JSON.parse(localStorage.getItem("orders") || "[]");
      localStorage.setItem("orders", JSON.stringify(local.filter(o => o.id !== id)));
    } catch {
      setError("Nuk u fshi nga serveri.");
      fetchOrders();
    }
  };

  const S = {
    page:   { background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, sans-serif", color: "#1F1F1F" },
    wrap:   { maxWidth: "1200px", margin: "0 auto" },
    header: { borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
    h2:     { fontFamily: "Georgia, serif", fontSize: "30px", color: "#2B1A4A", margin: 0 },
    tag:    { fontSize: "11px", letterSpacing: "2px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600", display: "block", marginBottom: "6px" },
    error:  { background: "#FFEAEA", color: "#C0392B", border: "1px solid #FFD1D1", padding: "12px 16px", marginBottom: "20px", fontSize: "13px" },
    refreshBtn: { background: "none", border: "1px solid #0E5A5B", color: "#0E5A5B", padding: "8px 16px", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" },
    table:  { width: "100%", background: "#FFF", borderCollapse: "collapse", border: "1px solid #E6E0D8" },
    th:     { padding: "14px 18px", background: "#2B1A4A", color: "#FFF", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: "500", textAlign: "left", whiteSpace: "nowrap" },
    td:     { padding: "15px 18px", borderBottom: "1px solid #EEE8E0", fontSize: "14px", verticalAlign: "middle" },
    delBtn: { background: "transparent", color: "#C0392B", border: "1px solid #C0392B", fontSize: "11px", letterSpacing: "0.8px", textTransform: "uppercase", padding: "5px 12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" },
    select: { border: "1px solid #D0C8C0", padding: "6px 10px", fontSize: "13px", background: "#FAFAFA", cursor: "pointer", fontFamily: "inherit" },
    empty:  { textAlign: "center", padding: "48px", color: "#999", fontStyle: "italic", fontSize: "14px" }
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.header}>
          <div>
            <span style={S.tag}>Sales & Logistics</span>
            <h2 style={S.h2}>Client Orders Registry</h2>
          </div>
          <button onClick={fetchOrders} style={S.refreshBtn}>↻ Rifresko</button>
        </div>

        {error && <div style={S.error}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#999", fontSize: "14px" }}>Duke ngarkuar porositë…</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={S.table}>
              <thead>
                <tr>
                  {["ID", "Klienti", "Data", "Adresa", "Vlera (€)", "Statusi", "Veprime"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} style={S.empty}>Nuk ka porosi aktive.</td></tr>
                ) : orders.map((order, i) => {
                  const status = (order.statusi || "PRITJE").toUpperCase();
                  const sStyle = STATUS_STYLE[status] || { background: "#F0EDE8", color: "#555" };
                  const clientName = order.klienti
                    ? `${order.klienti.emri || ""} ${order.klienti.mbiemri || ""}`.trim()
                    : "Guest";

                  return (
                    <tr key={order.id} style={{ background: i % 2 === 0 ? "#FFF" : "#FDFAF7" }}>
                      <td style={{ ...S.td, fontWeight: "700", color: "#0E5A5B" }}>#{order.id}</td>
                      <td style={S.td}>{clientName}</td>
                      <td style={{ ...S.td, color: "#777", whiteSpace: "nowrap" }}>
                        {order.dataPorosise ? new Date(order.dataPorosise).toLocaleDateString("sq-AL") : "—"}
                      </td>
                      <td style={{ ...S.td, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.adresaDorezimit || "—"}
                      </td>
                      <td style={{ ...S.td, fontWeight: "700", fontFamily: "Georgia, serif" }}>
                        {Number(order.shumeTotale || 0).toFixed(2)} €
                      </td>
                      <td style={S.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ ...sStyle, fontSize: "11px", fontWeight: "700", padding: "4px 10px", letterSpacing: "0.5px", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                            {status}
                          </span>
                          <select value={status} onChange={e => handleStatusChange(order.id, e.target.value)} style={S.select}>
                            {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        </div>
                      </td>
                      <td style={S.td}>
                        <button
                          onClick={() => handleDelete(order.id)}
                          style={S.delBtn}
                          onMouseEnter={e => { e.currentTarget.style.background = "#C0392B"; e.currentTarget.style.color = "#FFF"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C0392B"; }}
                        >Fshij</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCRUD;