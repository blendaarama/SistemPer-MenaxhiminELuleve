import React, { useEffect, useState } from "react";
import axios from "axios";

const InventoryCRUD = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    flowerId: "",
    physicalStock: "",
    reservedOrders: "",
    safetyLevel: "",
    lastAuditDate: ""
  });

  const API_URL = "http://localhost:8080/api/inventory";

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setInventory(res.data);
    } catch (err) {
      console.log("Inventory Backend jo aktiv. Gati kalimi në LocalStorage...");
      const localInventory = JSON.parse(localStorage.getItem("inventory")) || [
        { id: 1, flowerId: "101", flowerDescription: "Trëndafil i Kuq i Përjetshëm (Klasik)", physicalStock: 120, reservedOrders: 15, safetyLevel: 20, lastAuditDate: "2026-05-20" },
        { id: 2, flowerId: "102", flowerDescription: "Kuti Orkide Blu Mbretërore", physicalStock: 45, reservedOrders: 8, safetyLevel: 10, lastAuditDate: "2026-05-22" },
        { id: 3, flowerId: "103", flowerDescription: "Hortensie e Bardhë Kadife", physicalStock: 14, reservedOrders: 5, safetyLevel: 15, lastAuditDate: "2026-05-25" }
      ];
      setInventory(localInventory);
      if (!localStorage.getItem("inventory")) {
        localStorage.setItem("inventory", JSON.stringify(localInventory));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.flowerId || !formData.physicalStock) {
      setError("ID-ja Referuese e Lules dhe Stoku Fizik janë të detyrueshme.");
      return;
    }

    let generatedDesc = "Produkt Floral Premium";
    if (formData.flowerId === "104") generatedDesc = "Buqetë bozhure rozë pastel";
    if (formData.flowerId === "105") generatedDesc = "Arranxhim me luledielli të artë";

    const newLog = {
      id: Date.now(),
      flowerId: formData.flowerId,
      flowerDescription: generatedDesc,
      physicalStock: parseInt(formData.physicalStock) || 0,
      reservedOrders: parseInt(formData.reservedOrders) || 0,
      safetyLevel: parseInt(formData.safetyLevel) || 0,
      lastAuditDate: formData.lastAuditDate || new Date().toISOString().split('T')[0]
    };

    try {
      const res = await axios.post(API_URL, newLog);
      setInventory([...inventory, res.data]);
    } catch (err) {
      console.log("Ruajtja në backend dështoi. Ruhet lokalisht...");
      const localInventory = JSON.parse(localStorage.getItem("inventory")) || [];
      const updated = [...localInventory, newLog];
      localStorage.setItem("inventory", JSON.stringify(updated));
      setInventory(updated);
    }

    setFormData({ flowerId: "", physicalStock: "", reservedOrders: "", safetyLevel: "", lastAuditDate: "" });
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të hiqni këtë regjistrim nga magazina?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setInventory(inventory.filter(item => item.id !== id));
    } catch (err) {
      console.log("Fshirja në backend dështoi. Fshihet nga LocalStorage...");
      const updated = inventory.filter(item => item.id !== id);
      localStorage.setItem("inventory", JSON.stringify(updated));
      setInventory(updated);
    }
  };

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Logjistika</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Regjistri i Magazinës (Stoku)</h2>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1', padding: "12px", fontSize: '13px', marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "40px", alignItems: "start" }}>
          
          {/* FORM - LOG NEW INVENTORY STOCK */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
              Përditëso Gjendjen e Magazinës
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>ID Referuese e Lules</label>
                <input type="text" value={formData.flowerId} onChange={(e) => setFormData({...formData, flowerId: e.target.value})} placeholder="Psh. 104" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Stoku Fizik Aktual</label>
                  <input type="number" value={formData.physicalStock} onChange={(e) => setFormData({...formData, physicalStock: e.target.value})} placeholder="Njësi në magazinë" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Të Rezervuara për Porosi</label>
                  <input type="number" value={formData.reservedOrders} onChange={(e) => setFormData({...formData, reservedOrders: e.target.value})} placeholder="Njësi të alokuara" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Niveli Minimal i Sigurisë</label>
                <input type="number" value={formData.safetyLevel} onChange={(e) => setFormData({...formData, safetyLevel: e.target.value})} placeholder="Limiti për alarm" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }} />
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Data e Auditit të Fundit</label>
                <input type="date" value={formData.lastAuditDate} onChange={(e) => setFormData({...formData, lastAuditDate: e.target.value})} style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", color: "#1F1F1F" }} />
              </div>

              <button type="submit" style={{ width: "100%", background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                Regjistro në Stok
              </button>
            </form>
          </div>

          {/* TABLE - INVENTORY LOG MATRIX */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke sinkronizuar magazinën...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>ID</th>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Përshkrimi i Lules</th>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>Gjendja</th>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>Rezervuar</th>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>Min Sigurie</th>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Datë Auditi</th>
                    <th style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>Veprime</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                        Nuk ka asnjë regjistrim të stokut në magazinë.
                      </td>
                    </tr>
                  ) : (
                    inventory.map((item) => {
                      const isLowStock = item.physicalStock <= item.safetyLevel;
                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #E6E0D8", background: isLowStock ? "#FFF9F9" : "transparent" }}>
                          <td style={{ padding: "16px 15px", fontWeight: "600", color: "#0E5A5B" }}>#{item.flowerId}</td>
                          <td style={{ padding: "16px 15px", fontWeight: "600", color: "#2B1A4A" }}>{item.flowerDescription}</td>
                          <td style={{ padding: "16px 15px", textAlign: "center", fontWeight: "700", color: isLowStock ? "#C62828" : "#1F1F1F" }}>
                            {item.physicalStock}
                            {isLowStock && <span style={{ display: "block", fontSize: "9px", color: "#C62828", fontWeight: "700" }}>STOK I ULËT</span>}
                          </td>
                          <td style={{ padding: "16px 15px", textAlign: "center", color: "rgba(31,31,31,0.6)" }}>{item.reservedOrders}</td>
                          <td style={{ padding: "16px 15px", textAlign: "center" }}>{item.safetyLevel}</td>
                          <td style={{ padding: "16px 15px", fontSize: "12.5px", color: "rgba(31,31,31,0.6)" }}>{item.lastAuditDate}</td>
                          <td style={{ padding: "16px 15px", textAlign: "center" }}>
                            <button onClick={() => handleDelete(item.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 8px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>
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

export default InventoryCRUD;