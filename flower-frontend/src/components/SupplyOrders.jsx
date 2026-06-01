import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/supply-orders";
const SUPPLIERS_API = "http://localhost:8080/api/suppliers";
const FLOWERS_API = "http://localhost:8080/api/flowers";

const STATUS_OPTIONS = ["DRAFT", "ORDERED", "IN_TRANSIT", "RECEIVED", "CANCELLED"];

const STATUS_STYLE = {
  DRAFT:      { background: "#F5F5F5", color: "#616161" },
  ORDERED:    { background: "#E3F2FD", color: "#1565C0" },
  IN_TRANSIT: { background: "#FFF3E0", color: "#E65100" },
  RECEIVED:   { background: "#E8F5E9", color: "#2E7D32" },
  CANCELLED:  { background: "#FFEBEE", color: "#C62828" }
};

const initialForm = {
  id: null,
  supplierId: "",
  flowerId: "",
  quantity: "",
  unitCost: "",
  orderDate: new Date().toISOString().split("T")[0],
  expectedDelivery: "",
  status: "DRAFT",
  notes: ""
};

const SupplyOrdersCRUD = () => {
  const [orders, setOrders]       = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [flowers, setFlowers]     = useState([]);
  const [form, setForm]           = useState(initialForm);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` }
  });

  useEffect(() => {
    fetchOrders();
    loadRefData();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL, authHeaders());
      setOrders(Array.isArray(res.data) ? res.data : res.data?.content ?? []);
    } catch {
      const local = JSON.parse(localStorage.getItem("supplyOrders") || "[]");
      setOrders(local.length ? local : [
        { id: 1, supplierId: 1, supplierName: "Flower Power LLC", flowerId: 1, flowerName: "Trëndafil i Kuq", quantity: 200, unitCost: 1.20, orderDate: "2026-05-20", expectedDelivery: "2026-06-01", status: "RECEIVED", notes: "Porosi e rregullt mujore." },
        { id: 2, supplierId: 2, supplierName: "Amelia Flora Wholesales", flowerId: 2, flowerName: "Orkide Blu", quantity: 50, unitCost: 4.50, orderDate: "2026-05-28", expectedDelivery: "2026-06-10", status: "IN_TRANSIT", notes: "" }
      ]);
      setError("⚠️ Backend jo aktiv — po shfaqen të dhëna lokale.");
    } finally {
      setLoading(false);
    }
  };

  const loadRefData = async () => {
    try {
      const [s, f] = await Promise.allSettled([
        axios.get(SUPPLIERS_API, authHeaders()),
        axios.get(FLOWERS_API)
      ]);
      if (s.status === "fulfilled") setSuppliers(Array.isArray(s.value.data) ? s.value.data : []);
      if (f.status === "fulfilled") setFlowers(Array.isArray(f.value.data) ? f.value.data : []);
    } catch { /* silent */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplierId || !form.flowerId || !form.quantity || !form.unitCost) {
      setError("Furnitori, Lulja, Sasia dhe Çmimi janë të detyrueshme.");
      return;
    }
    setError("");

    const sup = suppliers.find(s => s.id === Number(form.supplierId));
    const flo = flowers.find(f => f.id === Number(form.flowerId));

    const payload = {
      ...form,
      id: form.id || Date.now(),
      supplierId: Number(form.supplierId),
      supplierName: sup?.corporateName || `Furnitori #${form.supplierId}`,
      flowerId: Number(form.flowerId),
      flowerName: flo?.emertimi || `Lulja #${form.flowerId}`,
      quantity: Number(form.quantity),
      unitCost: parseFloat(form.unitCost)
    };

    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, payload, authHeaders());
      } else {
        await axios.post(API_URL, payload, authHeaders());
      }
      fetchOrders();
    } catch {
      const local = JSON.parse(localStorage.getItem("supplyOrders") || "[]");
      const updated = form.id
        ? local.map(o => o.id === form.id ? payload : o)
        : [...local, payload];
      localStorage.setItem("supplyOrders", JSON.stringify(updated));
      setOrders(updated);
    }
    setForm(initialForm);
  };

  const handleStatusChange = async (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus }, authHeaders());
    } catch {
      const local = JSON.parse(localStorage.getItem("supplyOrders") || "[]");
      localStorage.setItem("supplyOrders", JSON.stringify(local.map(o => o.id === id ? { ...o, status: newStatus } : o)));
    }
  };

  const handleEdit = (o) => {
    setForm({ ...o });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë porosi furnizimi?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, authHeaders());
    } catch {
      const updated = orders.filter(o => o.id !== id);
      localStorage.setItem("supplyOrders", JSON.stringify(updated));
    }
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const totalCost = (o) => (Number(o.quantity) * Number(o.unitCost)).toFixed(2);

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Prokurimi</span>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A", margin: 0 }}>Porositë e Furnizimit</h2>
          </div>
          <button onClick={fetchOrders} style={{ background: "none", border: "1px solid #0E5A5B", color: "#0E5A5B", padding: "8px 16px", cursor: "pointer", fontSize: "13px" }}>↻ Rifresko</button>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FFEAEA", color: "#C0392B", border: "1px solid #FFD1D1", padding: "12px", fontSize: "13px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* FORM */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px", marginBottom: "40px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
            {form.id ? "Ndrysho Porosinë e Furnizimit" : "Krijo Porosi të Re Furnizimi"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Furnitori</label>
                <select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }}>
                  <option value="">Zgjidh Furnitorin...</option>
                  {suppliers.length > 0
                    ? suppliers.map(s => <option key={s.id} value={s.id}>{s.corporateName}</option>)
                    : <><option value="1">Flower Power LLC</option><option value="2">Amelia Flora Wholesales</option></>
                  }
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Lulja / Produkti</label>
                <select value={form.flowerId} onChange={e => setForm({ ...form, flowerId: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }}>
                  <option value="">Zgjidh Lulen...</option>
                  {flowers.length > 0
                    ? flowers.map(f => <option key={f.id} value={f.id}>{f.emertimi}</option>)
                    : <option value="1">Trëndafil i Kuq</option>
                  }
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Statusi</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              {[
                { label: "Sasia", field: "quantity", placeholder: "100" },
                { label: "Çmimi Njësi (€)", field: "unitCost", placeholder: "1.50" },
                { label: "Data e Porosisë", field: "orderDate", type: "date" },
                { label: "Dorëzimi i Pritshëm", field: "expectedDelivery", type: "date" }
              ].map(({ label, field, placeholder, type = "text" }) => (
                <div key={field}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>{label}</label>
                  <input type={field === "quantity" ? "number" : field === "unitCost" ? "number" : type} step="0.01" min="0" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Shënime</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows="2" placeholder="Instruksione ose komente shtesë..." style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", fontFamily: "inherit", resize: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button type="submit" style={{ background: "#0E5A5B", color: "#FFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
                {form.id ? "Përditëso Porosinë" : "Konfirmo Porosinë"}
              </button>
              {form.id && (
                <button type="button" onClick={() => setForm(initialForm)} style={{ background: "transparent", color: "#1F1F1F", border: "1px solid #C4B9AF", padding: "11px 24px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>Anulo</button>
              )}
            </div>
          </form>
        </div>

        {/* TABLE */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)" }}>Duke ngarkuar porositë e furnizimit...</div>
        ) : (
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                  {["ID", "Furnitori", "Lulja", "Sasia", "Çmimi/Njësi", "Totali", "Data Porosisë", "Dorëzimi", "Statusi", "Veprime"].map((h, i) => (
                    <th key={h} style={{ padding: "14px 12px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", whiteSpace: "nowrap", textAlign: i >= 3 ? "center" : "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="10" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>Nuk ka porosi furnizimi të regjistruara.</td></tr>
                ) : orders.map((o, i) => {
                  const ss = STATUS_STYLE[o.status] || { background: "#F0EDE8", color: "#555" };
                  return (
                    <tr key={o.id} style={{ borderBottom: "1px solid #E6E0D8", background: i % 2 === 0 ? "#FFF" : "#FDFAF7" }}>
                      <td style={{ padding: "14px 12px", fontWeight: "600", color: "#0E5A5B" }}>#{String(o.id).slice(-4)}</td>
                      <td style={{ padding: "14px 12px", fontWeight: "600", color: "#2B1A4A" }}>{o.supplierName}</td>
                      <td style={{ padding: "14px 12px" }}>{o.flowerName}</td>
                      <td style={{ padding: "14px 12px", textAlign: "center", fontWeight: "600" }}>{o.quantity}</td>
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>€{Number(o.unitCost).toFixed(2)}</td>
                      <td style={{ padding: "14px 12px", textAlign: "center", fontWeight: "700", color: "#2B1A4A" }}>€{totalCost(o)}</td>
                      <td style={{ padding: "14px 12px", textAlign: "center", color: "rgba(31,31,31,0.6)", whiteSpace: "nowrap" }}>{o.orderDate}</td>
                      <td style={{ padding: "14px 12px", textAlign: "center", color: "rgba(31,31,31,0.6)", whiteSpace: "nowrap" }}>{o.expectedDelivery || "—"}</td>
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          style={{ ...ss, fontSize: "11px", fontWeight: "700", padding: "4px 8px", border: "none", cursor: "pointer", textTransform: "uppercase" }}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: "14px 12px", textAlign: "center" }}>
                        <button onClick={() => handleEdit(o)} style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", padding: "4px 8px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer", marginRight: "5px" }}>Edit</button>
                        <button onClick={() => handleDelete(o.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 8px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>Fshij</button>
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

export default SupplyOrdersCRUD;