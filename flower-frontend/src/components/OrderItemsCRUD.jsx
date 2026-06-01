import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL      = "http://localhost:8080/api/order-details";
const ORDERS_API   = "http://localhost:8080/api/porosi";
const BOUQUETS_API = "http://localhost:8080/api/bouquets";
const FLOWERS_API  = "http://localhost:8080/api/flowers";

const initialForm = { id: null, orderId: "", productId: "", productType: "BOUQUET", quantity: 1, unitPrice: "" };

const OrderItemsCRUD = () => {
  const [items, setItems]       = useState([]);
  const [orders, setOrders]     = useState([]);
  const [bouquets, setBouquets] = useState([]);
  const [flowers, setFlowers]   = useState([]);
  const [form, setForm]         = useState(initialForm);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // ✅ Nuk nevojitet më cfg() — interceptori në main.jsx e shton token-in automatikisht
  useEffect(() => {
    fetchItems();
    axios.get(ORDERS_API)
      .then(r => setOrders(Array.isArray(r.data) ? r.data : r.data?.content ?? []))
      .catch(() => {});
    axios.get(BOUQUETS_API).then(r => setBouquets(r.data)).catch(() => {});
    axios.get(FLOWERS_API).then(r => setFlowers(r.data)).catch(() => {});
  }, []);

  const fetchItems = async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get(API_URL);
      setItems(Array.isArray(res.data) ? res.data : res.data?.content ?? []);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError("401 — Token ka skaduar. Kyçuni sërish.");
      } else if (status === 403) {
        setError("403 — Nuk keni të drejta për këtë burim.");
      } else {
        const local = JSON.parse(localStorage.getItem("order-items") || "[]");
        setItems(local.length ? local : [
          { id: 1, orderId: 101, productId: 3, productType: "BOUQUET", quantity: 2, unitPrice: 25.00 },
          { id: 2, orderId: 101, productId: 1, productType: "FLOWER",  quantity: 5, unitPrice: 3.50  },
        ]);
        setError("⚠️ Backend jo aktiv — po shfaqen të dhëna lokale.");
      }
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.orderId || !form.productId) { setError("ID e porosisë dhe produkti janë të detyrueshme."); return; }

    const payload = {
      ...form,
      orderId:   Number(form.orderId),
      productId: Number(form.productId),
      quantity:  Number(form.quantity),
      unitPrice: parseFloat(form.unitPrice) || 0,
    };

    try {
      if (form.id) await axios.put(`${API_URL}/${form.id}`, payload);
      else         await axios.post(API_URL, payload);
      fetchItems(); setForm(initialForm);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) setError("401 — Token ka skaduar. Kyçuni sërish.");
      else if (status === 403) setError("403 — Nuk keni të drejta për këtë veprim.");
      else {
        // Fallback lokal nëse serveri nuk arrin
        const local = JSON.parse(localStorage.getItem("order-items") || "[]");
        const newItem = { ...payload, id: form.id || Date.now() };
        const updated = form.id
          ? local.map(i => i.id === form.id ? newItem : i)
          : [...local, newItem];
        localStorage.setItem("order-items", JSON.stringify(updated));
        setItems(updated); setForm(initialForm);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A dëshironi ta fshini këtë zë porosie?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) setError("401 — Token ka skaduar. Kyçuni sërish.");
      else if (status === 403) setError("403 — Nuk keni të drejta për fshirje.");
      else {
        const updated = items.filter(i => i.id !== id);
        localStorage.setItem("order-items", JSON.stringify(updated));
        setItems(updated);
      }
    }
  };

  const getProductName = (item) => {
    if (item.productType === "BOUQUET")
      return bouquets.find(b => b.id === item.productId)?.emertimi || `Buqetë #${item.productId}`;
    return flowers.find(f => f.id === item.productId)?.emertimi || `Lule #${item.productId}`;
  };

  const totalValue = items.reduce((sum, i) => sum + (Number(i.unitPrice) * Number(i.quantity)), 0);

  const S = {
    page:  { background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, sans-serif", color: "#1F1F1F" },
    label: { display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" },
    input: { width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box", fontSize: "14px" },
    th:    { padding: "14px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" },
    td:    { padding: "14px 15px", borderBottom: "1px solid #E6E0D8" },
  };

  return (
    <div style={S.page}><div style={{ maxWidth: "1300px", margin: "0 auto" }}>

      <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Sales Detail</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Detajet e Zërave të Porosive</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", color: "rgba(31,31,31,0.5)", textTransform: "uppercase" }}>Vlera Totale e Zërave</div>
          <div style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#2B1A4A" }}>€{totalValue.toFixed(2)}</div>
        </div>
      </div>

      {error && (
        <div style={{ background: "#FFEAEA", color: "#C0392B", border: "1px solid #FFD1D1", padding: "12px", fontSize: "13px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "40px", alignItems: "start" }}>

        <div style={{ background: "#FFF", border: "1px solid #E6E0D8", padding: "30px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
            {form.id ? "Modifiko Zërin" : "Shto Zë Porosie"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={S.label}>Porosia</label>
              <select value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} style={S.input}>
                <option value="">Zgjidh porosinë...</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    #{o.id} — {o.klienti ? `${o.klienti.emri} ${o.klienti.mbiemri}` : "Guest"}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={S.label}>Lloji Produktit</label>
              <select value={form.productType} onChange={e => setForm({ ...form, productType: e.target.value, productId: "" })} style={S.input}>
                <option value="BOUQUET">Buqetë</option>
                <option value="FLOWER">Lule</option>
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={S.label}>{form.productType === "BOUQUET" ? "Buqeta" : "Lulja"}</label>
              <select value={form.productId} onChange={e => {
                const id = e.target.value;
                const list = form.productType === "BOUQUET" ? bouquets : flowers;
                const prod = list.find(p => String(p.id) === id);
                setForm({ ...form, productId: id, unitPrice: prod?.cmimi || form.unitPrice });
              }} style={S.input}>
                <option value="">Zgjidh...</option>
                {(form.productType === "BOUQUET" ? bouquets : flowers).map(p => (
                  <option key={p.id} value={p.id}>{p.emertimi} — €{Number(p.cmimi).toFixed(2)}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "25px" }}>
              <div>
                <label style={S.label}>Sasia</label>
                <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Çmimi Njësi (€)</label>
                <input type="number" step="0.01" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} placeholder="0.00" style={S.input} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={{ flex: 1, background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                {form.id ? "Përditëso" : "Shto Zërin"}
              </button>
              {form.id && (
                <button type="button" onClick={() => setForm(initialForm)} style={{ background: "transparent", border: "1px solid #C4B9AF", padding: "12px 16px", cursor: "pointer" }}>✕</button>
              )}
            </div>
          </form>
        </div>

        <div style={{ background: "#FFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke ngarkuar zërat...</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ background: "#2B1A4A", color: "#FFF", textAlign: "left" }}>
                  {["ID", "Porosia", "Produkti", "Lloji", "Sasia", "Çmimi Njësi", "Totali", "Veprime"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                      Nuk ka zëra porosish të regjistruar.
                    </td>
                  </tr>
                ) : items.map((item, i) => (
                  <tr key={item.id} style={{ background: i % 2 === 0 ? "#FFF" : "#FDFAF7" }}>
                    <td style={S.td}><span style={{ fontWeight: "600", color: "#0E5A5B" }}>#{String(item.id).slice(-4)}</span></td>
                    <td style={{ ...S.td, fontWeight: "600", color: "#2B1A4A" }}>#{item.orderId}</td>
                    <td style={S.td}>{getProductName(item)}</td>
                    <td style={S.td}>
                      <span style={{
                        fontSize: "10px", fontWeight: "700", padding: "3px 8px", textTransform: "uppercase",
                        background: item.productType === "BOUQUET" ? "#EDE7F6" : "#E8F5E9",
                        color:      item.productType === "BOUQUET" ? "#4527A0"  : "#2E7D32",
                      }}>
                        {item.productType === "BOUQUET" ? "Buqetë" : "Lule"}
                      </span>
                    </td>
                    <td style={{ ...S.td, textAlign: "right", fontWeight: "600" }}>{item.quantity}</td>
                    <td style={{ ...S.td, textAlign: "right" }}>€{Number(item.unitPrice).toFixed(2)}</td>
                    <td style={{ ...S.td, textAlign: "right", fontWeight: "700", color: "#0E5A5B" }}>
                      €{(Number(item.unitPrice) * Number(item.quantity)).toFixed(2)}
                    </td>
                    <td style={{ ...S.td, textAlign: "center" }}>
                      <button
                        onClick={() => { setForm({ id: item.id, orderId: item.orderId, productId: item.productId, productType: item.productType, quantity: item.quantity, unitPrice: item.unitPrice }); window.scrollTo(0, 0); }}
                        style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", padding: "4px 8px", fontSize: "11px", cursor: "pointer", marginRight: "5px" }}
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}
                      >Fshij</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div></div>
  );
};

export default OrderItemsCRUD;