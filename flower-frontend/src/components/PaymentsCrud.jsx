import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/payments";

const PaymentsCRUD = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const [formData, setFormData] = useState({
    orderId: "",
    amount: "",
    paymentMethod: "CASH",
    clearanceStatus: "COMPLETED",
    processingDate: ""
  });

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setPayments(res.data);
    } catch {
      const localPayments = JSON.parse(localStorage.getItem("payments")) || [
        { id: 7041, orderId: "ORD-9921", amount: 45.00, paymentMethod: "CARD", clearanceStatus: "COMPLETED", processingDate: "2026-05-24" },
        { id: 7042, orderId: "ORD-9925", amount: 120.00, paymentMethod: "CASH", clearanceStatus: "PENDING", processingDate: "2026-05-25" }
      ];
      setPayments(localPayments);
      if (!localStorage.getItem("payments")) {
        localStorage.setItem("payments", JSON.stringify(localPayments));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.orderId || !formData.amount) {
      setError("ID e Porosisë dhe Vlera e Transaksionit janë të detyrueshme.");
      return;
    }

    const newPayment = {
      id: Date.now(),
      orderId: "ORD-" + formData.orderId,
      amount: parseFloat(formData.amount) || 0,
      paymentMethod: formData.paymentMethod,
      clearanceStatus: formData.clearanceStatus,
      processingDate: formData.processingDate || new Date().toISOString().split("T")[0]
    };

    try {
      const res = await axios.post(API_URL, newPayment);
      setPayments(prev => [...prev, res.data]);
    } catch {
      const local = JSON.parse(localStorage.getItem("payments")) || [];
      const updated = [...local, newPayment];
      localStorage.setItem("payments", JSON.stringify(updated));
      setPayments(updated);
    }

    setFormData({ orderId: "", amount: "", paymentMethod: "CASH", clearanceStatus: "COMPLETED", processingDate: "" });
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë rekord pagese?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch {
      const updated = payments.filter(p => p.id !== id);
      localStorage.setItem("payments", JSON.stringify(updated));
    }
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  // FIX: Badge style with correct border as a proper CSS property
  const badgeStyle = (status) => {
    const map = {
      COMPLETED: { background: "#E8F5E9", color: "#2E7D32", border: "1px solid #C8E6C9" },
      PENDING:   { background: "#FFF3E0", color: "#E65100", border: "1px solid #FFE0B2" },
      FAILED:    { background: "#FFEBEE", color: "#C62828", border: "1px solid #FFCDD2" }
    };
    return map[status] || map.FAILED;
  };

  const labelMap = { COMPLETED: "E Kryer", PENDING: "Në Pritje", FAILED: "E Dështuar" };

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Financat</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Auditimi i Pagesave</h2>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FFEAEA", color: "#C0392B", border: "1px solid #FFD1D1", padding: "12px", fontSize: "13px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "40px", alignItems: "start" }}>

          {/* FORM */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
              Regjistro Pagesë të Re (Manuale)
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>ID e Porosisë së Bashkëngjitur</label>
                <input type="text" value={formData.orderId} onChange={e => setFormData({ ...formData, orderId: e.target.value })} placeholder="Psh. 7041" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Vlera e Transaksionit (€)</label>
                <input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="0.00" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Metoda e Pagesës</label>
                  <select value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }}>
                    <option value="CASH">Para në Dorë (Cash)</option>
                    <option value="CARD">Kartelë Bankare</option>
                    <option value="BANK_TRANSFER">Transfer Bankar</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Statusi i Likuidimit</label>
                  <select value={formData.clearanceStatus} onChange={e => setFormData({ ...formData, clearanceStatus: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }}>
                    <option value="COMPLETED">E Përfunduar</option>
                    <option value="PENDING">Në Pritje</option>
                    <option value="FAILED">E Dështuar</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Data e Procesimit</label>
                <input type="date" value={formData.processingDate} onChange={e => setFormData({ ...formData, processingDate: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", color: "#1F1F1F", boxSizing: "border-box" }} />
              </div>

              <button type="submit" style={{ width: "100%", background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                Konfirmo Pagesën
              </button>
            </form>
          </div>

          {/* TABLE */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke sinkronizuar financat...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                    {[
                      { label: "ID Transaksioni", align: "left" },
                      { label: "Kodi i Porosisë", align: "left" },
                      { label: "Vlera Totale", align: "right" },
                      { label: "Metoda", align: "center" },
                      { label: "Statusi", align: "center" },
                      { label: "Data e Ekzekutimit", align: "left" },
                      { label: "Veprime", align: "center" }
                    ].map(({ label, align }) => (
                      <th key={label} style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: align }}>{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                        Nuk ka asnjë deklaratë të pagesave të regjistruar.
                      </td>
                    </tr>
                  ) : payments.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #E6E0D8", background: i % 2 === 0 ? "#FFF" : "#FDFAF7" }}>
                      <td style={{ padding: "16px 15px", fontWeight: "600", color: "#0E5A5B" }}>#{p.id.toString().slice(-4)}</td>
                      <td style={{ padding: "16px 15px", fontWeight: "600", color: "#2B1A4A" }}>{p.orderId}</td>
                      <td style={{ padding: "16px 15px", textAlign: "right", fontWeight: "700", color: "#2B1A4A" }}>€{Number(p.amount).toFixed(2)}</td>
                      <td style={{ padding: "16px 15px", textAlign: "center", fontWeight: "600", fontSize: "12px" }}>{p.paymentMethod}</td>
                      <td style={{ padding: "16px 15px", textAlign: "center" }}>
                        {/* FIX: border is now a proper CSS string property, not a value without "1px solid" */}
                        <span style={{ fontSize: "10px", fontWeight: "700", padding: "4px 8px", textTransform: "uppercase", ...badgeStyle(p.clearanceStatus) }}>
                          {labelMap[p.clearanceStatus] || p.clearanceStatus}
                        </span>
                      </td>
                      <td style={{ padding: "16px 15px", color: "rgba(31,31,31,0.6)" }}>{p.processingDate}</td>
                      <td style={{ padding: "16px 15px", textAlign: "center" }}>
                        <button onClick={() => handleDelete(p.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 8px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>
                          Fshij
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsCRUD;