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
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setOrders(local);
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

      if (s.status === "fulfilled") setSuppliers(s.value.data || []);
      if (f.status === "fulfilled") setFlowers(f.value.data || []);
    } catch {}
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
      unitCost: Number(form.unitCost)
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
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status: newStatus } : o)
    );

    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus }, authHeaders());
    } catch {
      const local = JSON.parse(localStorage.getItem("supplyOrders") || "[]");
      const updated = local.map(o =>
        o.id === id ? { ...o, status: newStatus } : o
      );
      localStorage.setItem("supplyOrders", JSON.stringify(updated));
    }
  };

  const handleEdit = (o) => {
    setForm({
      ...o,
      supplierId: String(o.supplierId || ""),
      flowerId: String(o.flowerId || "")
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`, authHeaders());
    } catch {
      const local = JSON.parse(localStorage.getItem("supplyOrders") || "[]");
      const updated = local.filter(o => o.id !== id);
      localStorage.setItem("supplyOrders", JSON.stringify(updated));
    }

    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const totalCost = (o) =>
    (Number(o.quantity) * Number(o.unitCost)).toFixed(2);

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>

      {/* HEADER */}
      <h2>Porositë e Furnizimit</h2>
      <button onClick={fetchOrders}>Rifresko</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>

        {/* SUPPLIER */}
        <select
          value={form.supplierId}
          onChange={e => setForm({ ...form, supplierId: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        >
          <option value="">Zgjidh Furnitorin</option>
          {suppliers.map(s => (
            <option key={s.id} value={String(s.id)}>
              {s.corporateName}
            </option>
          ))}
        </select>

        {/* FLOWER */}
        <select
          value={form.flowerId}
          onChange={e => setForm({ ...form, flowerId: e.target.value })}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        >
          <option value="">Zgjidh Lulen</option>
          {flowers.map(f => (
            <option key={f.id} value={String(f.id)}>
              {f.emertimi}
            </option>
          ))}
        </select>

        <input
          placeholder="Sasia"
          value={form.quantity}
          onChange={e => setForm({ ...form, quantity: e.target.value })}
        />

        <input
          placeholder="Çmimi"
          value={form.unitCost}
          onChange={e => setForm({ ...form, unitCost: e.target.value })}
        />

        <button type="submit">
          {form.id ? "Përditëso" : "Krijo"}
        </button>
      </form>

      {/* TABLE */}
      <table border="1" style={{ marginTop: 30, width: "100%" }}>
        <thead>
          <tr>
            <th>Furnitori</th>
            <th>Lulja</th>
            <th>Sasia</th>
            <th>Totali</th>
            <th>Statusi</th>
            <th>Veprime</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.supplierName}</td>
              <td>{o.flowerName}</td>
              <td>{o.quantity}</td>
              <td>€{totalCost(o)}</td>

              <td>
                <select
                  value={o.status}
                  onChange={e => handleStatusChange(o.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>

              <td>
                <button onClick={() => handleEdit(o)}>Edit</button>
                <button onClick={() => handleDelete(o.id)}>Fshij</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default SupplyOrdersCRUD;