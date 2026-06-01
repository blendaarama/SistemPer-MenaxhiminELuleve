import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL       = "http://localhost:8080/api/supply-orders";
const SUPPLIERS_API = "http://localhost:8080/api/suppliers";
const FLOWERS_API   = "http://localhost:8080/api/flowers";

const initialForm = { id: null, supplierId: "", flowerId: "", quantity: "", unitCost: "", orderDate: "", expectedDelivery: "", status: "PENDING", notes: "" };

const STATUS_MAP = {
  PENDING:   { background: "#FFF3E0", color: "#E65100", border: "1px solid #FFE0B2", label: "Në Pritje"      },
  CONFIRMED: { background: "#E8F5E9", color: "#2E7D32", border: "1px solid #C8E6C9", label: "E Konfirmuar"   },
  DELIVERED: { background: "#E8F0FF", color: "#2B3A8A", border: "1px solid #C5CAE9", label: "E Dorëzuar"     },
  CANCELLED: { background: "#FFEBEE", color: "#C62828", border: "1px solid #FFCDD2", label: "E Anuluar"      },
};

const SupplyOrdersCRUD = () => {
  const [supplyOrders, setSupplyOrders] = useState([]);
  const [suppliers, setSuppliers]       = useState([]);
  const [flowers, setFlowers]           = useState([]);
  const [form, setForm]                 = useState(initialForm);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  useEffect(() => {
    fetchSupplyOrders();
    axios.get(SUPPLIERS_API).then(r => setSuppliers(r.data)).catch(() => {});
    axios.get(FLOWERS_API).then(r => setFlowers(r.data)).catch(() => {});
  }, []);

  const fetchSupplyOrders = async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get(API_URL);
      setSupplyOrders(Array.isArray(res.data) ? res.data : res.data?.content ?? []);
    } catch {
      const local = JSON.parse(localStorage.getItem("supply-orders") || "[]");
      setSupplyOrders(local.length ? local : [
        { id: 1, supplierId: 1, supplierName: "Flower Power LLC",  flowerId: 1, flowerName: "Trëndafil", quantity: 200, unitCost: 1.20, orderDate: "2026-05-20", expectedDelivery: "2026-05-27", status: "DELIVERED", notes: "Dorëzim standard" },
        { id: 2, supplierId: 2, supplierName: "Amelia Flora",      flowerId: 2, flowerName: "Orkide",    quantity: 50,  unitCost: 4.50, orderDate: "2026-05-28", expectedDelivery: "2026-06-04", status: "PENDING",   notes: "" },
      ]);
      setError("⚠️ Backend jo aktiv — po shfaqen të dhëna lokale.");
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.supplierId || !form.flowerId || !form.quantity) { setError("Furnitori, lulja dhe sasia janë të detyrueshme."); return; }

    const supplier = suppliers.find(s => String(s.id) === String(form.supplierId));
    const flower   = flowers.find(f => String(f.id) === String(form.flowerId));
    const payload  = {
      ...form,
      supplierId: Number(form.supplierId), supplierName: supplier?.corporateName || "",
      flowerId:   Number(form.flowerId),   flowerName:   flower?.emertimi        || "",
      quantity:   Number(form.quantity),   unitCost:     parseFloat(form.unitCost) || 0,
      orderDate:  form.orderDate || new Date().toISOString().split("T")[0],
    };

    try {
      if (form.id) await axios.put(`${API_URL}/${form.id}`, payload);
      else await axios.post(API_URL, payload);
      fetchSupplyOrders(); setForm(initialForm);
    } catch {
      const local = JSON.parse(localStorage.getItem("supply-orders") || "[]");
      const newItem = { ...payload, id: form.id || Date.now() };
      const updated = form.id ? local.map(i => i.id === form.id ? newItem : i) : [...local, newItem];
      localStorage.setItem("supply-orders", JSON.stringify(updated));
      setSupplyOrders(updated); setForm(initialForm);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë porosi furnizimi?")) return;
    try { await axios.delete(`${API_URL}/${id}`); } catch {
      const updated = supplyOrders.filter(o => o.id !== id);
      localStorage.setItem("supply-orders", JSON.stringify(updated));
    }
    setSupplyOrders(prev => prev.filter(o => o.id !== id));
  };

  const totalCost = supplyOrders.reduce((sum, o) => sum + (Number(o.unitCost) * Number(o.quantity)), 0);

  const S = {
    page:  { background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, sans-serif", color: "#1F1F1F" },
    label: { display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" },
    input: { width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box", fontSize: "14px" },
    th:    { padding: "14px 12px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" },
    td:    { padding: "14px 12px", borderBottom: "1px solid #E6E0D8" },
  };

  return (
    <div style={S.page}><div style={{ maxWidth: "1300px", margin: "0 auto" }}>

      <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Zinxhiri i Furnizimit</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Porositë e Furnizimit</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "11px", color: "rgba(31,31,31,0.5)", textTransform: "uppercase" }}>Vlera Totale Furnizimeve</div>
          <div style={{ fontSize: "26px", fontFamily: "Georgia, serif", color: "#2B1A4A" }}>€{totalCost.toFixed(2)}</div>
        </div>
      </div>

      {error && <div style={{ background: "#FFEAEA", color: "#C0392B", border: "1px solid #FFD1D1", padding: "12px", fontSize: "13px", marginBottom: "20px" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "40px", alignItems: "start" }}>

        <div style={{ background: "#FFF", border: "1px solid #E6E0D8", padding: "30px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
            {form.id ? "Modifiko Porosinë" : "Krijo Porosi Furnizimi"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label style={S.label}>Furnitori</label>
              <select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} style={S.input}>
                <option value="">Zgjidh furnitorin...</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.corporateName}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={S.label}>Lulja / Produkti</label>
              <select value={form.flowerId} onChange={e => {
                const flower = flowers.find(f => String(f.id) === e.target.value);
                setForm({ ...form, flowerId: e.target.value, unitCost: flower?.cmimi || form.unitCost });
              }} style={S.input}>
                <option value="">Zgjidh lulen...</option>
                {flowers.map(f => <option key={f.id} value={f.id}>{f.emertimi}</option>)}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "15px" }}>
              <div>
                <label style={S.label}>Sasia</label>
                <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="njësi" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Kostoja Njësi (€)</label>
                <input type="number" step="0.01" value={form.unitCost} onChange={e => setForm({ ...form, unitCost: e.target.value })} placeholder="0.00" style={S.input} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "15px" }}>
              <div>
                <label style={S.label}>Data e Porosisë</label>
                <input type="date" value={form.orderDate} onChange={e => setForm({ ...form, orderDate: e.target.value })} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Dorëzimi i Pritshëm</label>
                <input type="date" value={form.expectedDelivery} onChange={e => setForm({ ...form, expectedDelivery: e.target.value })} style={S.input} />
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={S.label}>Statusi</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={S.input}>
                {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={S.label}>Shënime</label>
              <textarea rows="2" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Instruksione shtesë..." style={{ ...S.input, resize: "none", fontFamily: "inherit" }} />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={{ flex: 1, background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                {form.id ? "Përditëso" : "Dërgo Porosinë"}
              </button>
              {form.id && <button type="button" onClick={() => setForm(initialForm)} style={{ background: "transparent", border: "1px solid #C4B9AF", padding: "12px 16px", cursor: "pointer" }}>✕</button>}
            </div>
          </form>
        </div>

        <div style={{ background: "#FFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke ngarkuar porositë...</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#2B1A4A", color: "#FFF", textAlign: "left" }}>
                  {["ID", "Furnitori", "Lulja", "Sasia", "Kosto Totale", "Data", "Dorëzimi", "Statusi", "Veprime"].map(h => (
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {supplyOrders.length === 0 ? (
                  <tr><td colSpan="9" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>Nuk ka porosi furnizimi.</td></tr>
                ) : supplyOrders.map((o, i) => {
                  const st = STATUS_MAP[o.status] || STATUS_MAP.PENDING;
                  return (
                    <tr key={o.id} style={{ background: i % 2 === 0 ? "#FFF" : "#FDFAF7" }}>
                      <td style={S.td}><span style={{ fontWeight: "600", color: "#0E5A5B" }}>#{String(o.id).slice(-4)}</span></td>
                      <td style={{ ...S.td, fontWeight: "600", color: "#2B1A4A" }}>{o.supplierName || `#${o.supplierId}`}</td>
                      <td style={S.td}>{o.flowerName || `#${o.flowerId}`}</td>
                      <td style={{ ...S.td, textAlign: "right", fontWeight: "600" }}>{o.quantity}</td>
                      <td style={{ ...S.td, textAlign: "right", fontWeight: "700", color: "#2B1A4A" }}>€{(Number(o.unitCost) * Number(o.quantity)).toFixed(2)}</td>
                      <td style={{ ...S.td, color: "rgba(31,31,31,0.6)", fontSize: "12px" }}>{o.orderDate}</td>
                      <td style={{ ...S.td, color: "rgba(31,31,31,0.6)", fontSize: "12px" }}>{o.expectedDelivery || "—"}</td>
                      <td style={S.td}>
                        <span style={{ fontSize: "10px", fontWeight: "700", padding: "4px 8px", textTransform: "uppercase", ...st }}>{st.label}</span>
                      </td>
                      <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                        <button onClick={() => { setForm({ ...o }); window.scrollTo(0, 0); }} style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", padding: "4px 8px", fontSize: "11px", cursor: "pointer", marginRight: "5px" }}>Edit</button>
                        <button onClick={() => handleDelete(o.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}>Fshij</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div></div>
  );
};

export default SupplyOrdersCRUD;