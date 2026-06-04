import React, { useEffect, useState } from "react";
import api from "../services/api.jsx";

const API_URL = "/api/order-details";

const emptyForm = {
  porosiaId: "",
  productType: "FLOWER",
  flowerId: "",
  bouquetId: "",
  sasia: 1,
  cmimiNjesi: "",
};

const OrderItemsCRUD = () => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [bouquets, setBouquets] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      const [itemsRes, ordersRes, flowersRes, bouquetsRes] = await Promise.all([
        api.get(API_URL),
        api.get("/api/porosi"),
        api.get("/api/flowers"),
        api.get("/api/bouquets"),
      ]);

      setItems(Array.isArray(itemsRes.data) ? itemsRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      setFlowers(Array.isArray(flowersRes.data) ? flowersRes.data : []);
      setBouquets(Array.isArray(bouquetsRes.data) ? bouquetsRes.data : []);
    } catch (err) {
      console.error("Gabim order details:", err.response?.data || err.message);
      setError("Nuk u ngarkuan të dhënat. Kontrollo backend-in ose token-in.");
    } finally {
      setLoading(false);
    }
  };

  const getFlowerPrice = (id) => {
    const flower = flowers.find((f) => Number(f.id) === Number(id));
    return Number(flower?.cmimi || flower?.price || 0);
  };

  const getBouquetPrice = (id) => {
    const bouquet = bouquets.find((b) => Number(b.id) === Number(id));
    return Number(bouquet?.cmimi || bouquet?.price || 0);
  };

  const handleProductTypeChange = (type) => {
    setForm({
      ...form,
      productType: type,
      flowerId: "",
      bouquetId: "",
      cmimiNjesi: "",
    });
  };

  const handleFlowerChange = (id) => {
    setForm({
      ...form,
      flowerId: id,
      bouquetId: "",
      cmimiNjesi: id ? getFlowerPrice(id) : "",
    });
  };

  const handleBouquetChange = (id) => {
    setForm({
      ...form,
      bouquetId: id,
      flowerId: "",
      cmimiNjesi: id ? getBouquetPrice(id) : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.porosiaId) {
      setError("Zgjedh porosinë.");
      return;
    }

    if (form.productType === "FLOWER" && !form.flowerId) {
      setError("Zgjedh lulen.");
      return;
    }

    if (form.productType === "BOUQUET" && !form.bouquetId) {
      setError("Zgjedh buqetën.");
      return;
    }

    const sasia = Number(form.sasia);
    const cmimi = Number(form.cmimiNjesi);

    if (sasia <= 0 || cmimi <= 0) {
      setError("Sasia dhe çmimi duhet të jenë më të mëdha se 0.");
      return;
    }

    const payload = {
      porosia: { id: Number(form.porosiaId) },
      flower: form.productType === "FLOWER" ? { id: Number(form.flowerId) } : null,
      buqeta: form.productType === "BOUQUET" ? { id: Number(form.bouquetId) } : null,
      sasia,
     cmimi_njesi: cmimi,
      shuma: Number((sasia * cmimi).toFixed(2)),
    };

    try {
      await api.post(API_URL, payload);
      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      console.error("Gabim gjatë ruajtjes:", err.response?.data || err.message);
      setError("Nuk u ruajt artikulli. Kontrollo backend-in dhe emrat e fushave.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je e sigurt që don me fshi këtë artikull?")) return;

    try {
      await api.delete(`${API_URL}/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gabim gjatë fshirjes:", err.response?.data || err.message);
      setError("Nuk u fshi artikulli.");
    }
  };

  const getPrice = (item) =>
    item.cmimiNjesi ?? item.cmimi_njesi ?? item.cmimi ?? 0;

  const getProductName = (item) =>
    item.flower?.emertimi ||
    item.buqeta?.emertimi ||
    item.flower?.name ||
    item.buqeta?.name ||
    "—";

  const totalValue = items.reduce((sum, item) => {
    return sum + Number(item.shuma || Number(item.sasia || 0) * Number(getPrice(item)));
  }, 0);

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: "1250px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", borderBottom: "1px solid #E6E0D8", paddingBottom: 24, marginBottom: 36 }}>
          <div>
            <span style={{ color: "#0E5A5B", letterSpacing: 3, fontSize: 12, fontWeight: 700 }}>
              SALES DETAIL
            </span>
            <h2 style={{ color: "#2B1A4A", fontFamily: "Georgia, serif", fontSize: 42, margin: "8px 0 0" }}>
              Detajet e Porosive
            </h2>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#777", fontSize: 13, textTransform: "uppercase" }}>
              Vlera totale e detajeve
            </div>
            <div style={{ color: "#2B1A4A", fontSize: 36, fontWeight: 800 }}>
              €{totalValue.toFixed(2)}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: "#FFEAEA", color: "#C62828", padding: 12, marginBottom: 20, border: "1px solid #FFD1D1" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 40 }}>
          <form onSubmit={handleSubmit} style={{ background: "white", padding: 28, border: "1px solid #E6E0D8", height: "fit-content" }}>
            <h3 style={{ marginTop: 0, marginBottom: 20, color: "#1F1F1F", fontSize: 26 }}>
              Shto Zë Porosie
            </h3>

            <select
              value={form.porosiaId}
              onChange={(e) => setForm({ ...form, porosiaId: e.target.value })}
              style={input}
            >
              <option value="">Zgjidh Porosinë</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  #{o.id} — {o.klienti ? `${o.klienti.emri || ""} ${o.klienti.mbiemri || ""}` : "Guest"}
                </option>
              ))}
            </select>

            <select
              value={form.productType}
              onChange={(e) => handleProductTypeChange(e.target.value)}
              style={input}
            >
              <option value="FLOWER">Lule</option>
              <option value="BOUQUET">Buqetë</option>
            </select>

            {form.productType === "FLOWER" ? (
              <select
                value={form.flowerId}
                onChange={(e) => handleFlowerChange(e.target.value)}
                style={input}
              >
                <option value="">Zgjidh Lulen</option>
                {flowers.map((f) => (
                  <option key={f.id} value={f.id}>
                    #{f.id} — {f.emertimi} — €{Number(f.cmimi || 0).toFixed(2)}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={form.bouquetId}
                onChange={(e) => handleBouquetChange(e.target.value)}
                style={input}
              >
                <option value="">Zgjidh Buqetën</option>
                {bouquets.map((b) => (
                  <option key={b.id} value={b.id}>
                    #{b.id} — {b.emertimi || b.name} — €{Number(b.cmimi || b.price || 0).toFixed(2)}
                  </option>
                ))}
              </select>
            )}

            <input
              type="number"
              min="1"
              placeholder="Sasia"
              value={form.sasia}
              onChange={(e) => setForm({ ...form, sasia: e.target.value })}
              style={input}
            />

            <input
              type="number"
              step="0.01"
              placeholder="Çmimi"
              value={form.cmimiNjesi}
              onChange={(e) => setForm({ ...form, cmimiNjesi: e.target.value })}
              style={input}
            />

            <div style={{ background: "#FAF8F5", padding: 12, marginBottom: 18, border: "1px solid #E6E0D8" }}>
              Totali: <strong>€{(Number(form.sasia || 0) * Number(form.cmimiNjesi || 0)).toFixed(2)}</strong>
            </div>

            <button type="submit" style={{ background: "#2B1A4A", color: "white", border: 0, padding: "14px 18px", width: "100%", fontWeight: 700, cursor: "pointer" }}>
              Shto Zërin
            </button>
          </form>

          <div style={{ background: "white", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            {loading ? (
              <p style={{ padding: 24 }}>Duke u ngarkuar...</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#2B1A4A", color: "white" }}>
                    <th style={th}>ID</th>
                    <th style={th}>Porosia</th>
                    <th style={th}>Produkti</th>
                    <th style={th}>Sasia</th>
                    <th style={th}>Çmimi</th>
                    <th style={th}>Totali</th>
                    <th style={th}>Veprime</th>
                  </tr>
                </thead>

                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: 28, textAlign: "center", color: "#777" }}>
                        Nuk ka të dhëna.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const price = Number(getPrice(item));
                      const total = Number(item.shuma || Number(item.sasia || 0) * price);

                      return (
                        <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={td}>#{item.id}</td>
                          <td style={td}>#{item.porosia?.id || "—"}</td>
                          <td style={td}>{getProductName(item)}</td>
                          <td style={td}>{item.sasia}</td>
                          <td style={td}>€{price.toFixed(2)}</td>
                          <td style={td}>€{total.toFixed(2)}</td>
                          <td style={td}>
                            <button onClick={() => handleDelete(item.id)} style={{ color: "#C62828", border: "1px solid #C62828", background: "white", padding: "6px 10px", cursor: "pointer" }}>
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

const input = {
  width: "100%",
  padding: 13,
  marginBottom: 14,
  border: "1px solid #BFB7AE",
  background: "#FAF8F5",
  fontSize: 15,
};

const th = {
  padding: 14,
  textAlign: "left",
  fontSize: 13,
};

const td = {
  padding: 14,
  fontSize: 14,
};

export default OrderItemsCRUD;