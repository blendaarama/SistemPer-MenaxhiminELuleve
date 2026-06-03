import React, { useEffect, useState } from "react";

const StatusBadge = ({ status }) => {
  const getStyle = (s) => {
    switch (s) {
      case "DELIVERED": return { bg: "#E8F5E9", color: "#2E7D32", text: "E DORËZUAR" };
      case "CANCELLED": return { bg: "#FFEBEE", color: "#C62828", text: "E ANULUAR" };
      default: return { bg: "#EBF3F9", color: "#1D6FA5", text: "NË RRUGË" };
    }
  };
  const style = getStyle(status);
  return (
    <span style={{ background: style.bg, color: style.color, padding: "4px 10px", borderRadius: "12px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>
      {style.text}
    </span>
  );
};

const DeliveriesCRUD = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [formData, setFormData] = useState({ orderId: "", carrierName: "", transitStatus: "IN_TRANSIT" });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("deliveries")) || [];
    setDeliveries(saved);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.orderId) return alert("Ju lutem plotësoni ID e porosisë!");
    
    const newDelivery = { 
      id: Date.now(), 
      ...formData, 
      orderId: formData.orderId.includes("ORD-") ? formData.orderId : "ORD-" + formData.orderId 
    };
    
    const updated = [...deliveries, newDelivery];
    setDeliveries(updated);
    localStorage.setItem("deliveries", JSON.stringify(updated));
    setFormData({ orderId: "", carrierName: "", transitStatus: "IN_TRANSIT" });
  };

  const deleteItem = (id) => {
    if(window.confirm("A jeni të sigurt?")) {
      const updated = deliveries.filter(d => d.id !== id);
      setDeliveries(updated);
      localStorage.setItem("deliveries", JSON.stringify(updated));
    }
  };

  return (
    <div style={{ padding: "40px 6%", fontFamily: "sans-serif", backgroundColor: "#FAF8F5", minHeight: "100vh" }}>
      <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#2B1A4A", margin: "0" }}>Menaxhimi i Dërgesave</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "40px" }}>
        <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px", height: "fit-content" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", marginBottom: "20px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px" }}>
            CAKTO RREGULLIM TË RI
          </h3>
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", marginBottom: "6px" }}>ID E POROSISË</label>
            <input style={{ width: "100%", padding: "10px", border: "1px solid #E6E0D8", marginBottom: "15px" }} 
                   value={formData.orderId} onChange={(e) => setFormData({...formData, orderId: e.target.value.replace(/[^0-9]/g, '')})} placeholder="psh. 8021" />
            
            <label style={{ display: "block", fontSize: "11px", fontWeight: "600", marginBottom: "6px" }}>KORRIERIT</label>
            <input style={{ width: "100%", padding: "10px", border: "1px solid #E6E0D8", marginBottom: "15px" }} 
                   value={formData.carrierName} onChange={(e) => setFormData({...formData, carrierName: e.target.value})} placeholder="psh. FedEx" />
            
            <button type="submit" style={{ width: "100%", background: "#0E5A5B", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", cursor: "pointer" }}>NIS DËRGESËN</button>
          </form>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", background: "#FFF" }}>
          <thead>
            <tr style={{ background: "#2B1A4A", color: "#FFF", textAlign: "left" }}>
              <th style={{ padding: "16px", fontSize: "11px" }}>MANIFEST ID</th>
              <th style={{ padding: "16px", fontSize: "11px" }}>POROSIA</th>
              <th style={{ padding: "16px", fontSize: "11px" }}>STATUSI</th>
              <th style={{ padding: "16px", fontSize: "11px" }}>VEPRIME</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                <td style={{ padding: "16px", color: "#0E5A5B", fontSize: "13px" }}>#{d.id.toString().slice(-4)}</td>
                <td style={{ padding: "16px", fontWeight: "600", fontSize: "13px" }}>{d.orderId}</td>
                <td style={{ padding: "16px" }}><StatusBadge status={d.transitStatus} /></td>
                <td style={{ padding: "16px" }}>
                  <button onClick={() => deleteItem(d.id)} style={{ background: "none", border: "none", color: "#C62828", cursor: "pointer", fontSize: "11px", textTransform: "uppercase" }}>Fshij</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveriesCRUD;