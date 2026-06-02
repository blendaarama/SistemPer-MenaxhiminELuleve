import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/supply-orders";
const SUPPLIERS_API = "http://localhost:8080/api/suppliers";
const FLOWERS_API = "http://localhost:8080/api/flowers";

const initialForm = {
  supplierId: "",
  flowerId: "",
  quantity: "",
  unitCost: "",
  orderDate: "",
  status: "PENDING",
};

const STATUS_MAP = {
  PENDING: {
    background: "#FFF3E0",
    color: "#E65100",
    label: "Në Pritje",
  },
  CONFIRMED: {
    background: "#E8F5E9",
    color: "#2E7D32",
    label: "E Konfirmuar",
  },
  DELIVERED: {
    background: "#E8F0FF",
    color: "#2B3A8A",
    label: "E Dorëzuar",
  },
  CANCELLED: {
    background: "#FFEBEE",
    color: "#C62828",
    label: "E Anuluar",
  },
};

const SupplyOrdersCRUD = () => {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchFlowers();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const res = await axios.get(API_URL);

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setError("Gabim gjatë marrjes së porosive.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(SUPPLIERS_API);

      setSuppliers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFlowers = async () => {
    try {
      const res = await axios.get(FLOWERS_API);

      setFlowers(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleFlowerChange = (e) => {
    const flowerId = e.target.value;

    const flower = flowers.find(
      (f) => String(f.id) === String(flowerId)
    );

    setForm({
      ...form,
      flowerId,
      unitCost: flower?.cmimi || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.supplierId ||
      !form.flowerId ||
      !form.quantity
    ) {
      setError("Plotëso të gjitha fushat.");
      return;
    }

    const supplier = suppliers.find(
      (s) => String(s.id) === String(form.supplierId)
    );

    const total =
      Number(form.quantity) *
      Number(form.unitCost);

    const payload = {
      supplierId: Number(form.supplierId),
      supplierName: supplier?.emertimi || "",
      dataPorosis:
        form.orderDate ||
        new Date().toISOString().split("T")[0],
      shumaTotale: total,
      statusi: form.status,
    };

    try {
      await axios.post(API_URL, payload);

      fetchOrders();

      setForm(initialForm);

      setError("");
    } catch (err) {
      console.log(err);
      setError("Gabim gjatë ruajtjes.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      setOrders((prev) =>
        prev.filter((o) => o.id !== id)
      );
    } catch (err) {
      console.log(err);
      setError("Fshirja dështoi.");
    }
  };

  const totalCost = orders.reduce(
    (sum, o) => sum + Number(o.shumaTotale || 0),
    0
  );

  const S = {
    page: {
      background: "#FAF8F5",
      minHeight: "100vh",
      padding: "40px 6%",
      fontFamily: "system-ui, sans-serif",
      color: "#1F1F1F",
    },

    label: {
      display: "block",
      fontSize: "11px",
      fontWeight: "600",
      textTransform: "uppercase",
      marginBottom: "6px",
      color: "rgba(31,31,31,0.6)",
    },

    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #C4B9AF",
      background: "#FAF8F5",
      boxSizing: "border-box",
      fontSize: "14px",
    },

    th: {
      padding: "14px 12px",
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      textAlign: "left",
    },

    td: {
      padding: "14px 12px",
      borderBottom: "1px solid #E6E0D8",
    },
  };

  return (
    <div style={S.page}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        <div
          style={{
            borderBottom: "1px solid #E6E0D8",
            paddingBottom: "20px",
            marginBottom: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                color: "#0E5A5B",
                textTransform: "uppercase",
                fontWeight: "600",
              }}
            >
              Zinxhiri i Furnizimit
            </span>

            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "32px",
                fontWeight: "400",
                marginTop: "6px",
                color: "#2B1A4A",
              }}
            >
              Porositë e Furnizimit
            </h2>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "11px",
                color: "rgba(31,31,31,0.5)",
                textTransform: "uppercase",
              }}
            >
              Vlera Totale
            </div>

            <div
              style={{
                fontSize: "26px",
                fontFamily: "Georgia, serif",
                color: "#2B1A4A",
              }}
            >
              €{totalCost.toFixed(2)}
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#FFEAEA",
              color: "#C0392B",
              border: "1px solid #FFD1D1",
              padding: "12px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2.2fr",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* FORM */}

          <div
            style={{
              background: "#FFF",
              border: "1px solid #E6E0D8",
              padding: "30px",
            }}
          >
            <h3
              style={{
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "25px",
                borderBottom: "2px solid #2B1A4A",
                paddingBottom: "8px",
                color: "#2B1A4A",
              }}
            >
              Krijo Porosi Furnizimi
            </h3>

            <form onSubmit={handleSubmit}>
              {/* SUPPLIER */}

              <div style={{ marginBottom: "15px" }}>
                <label style={S.label}>Furnitori</label>

                <select
                  value={form.supplierId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      supplierId: e.target.value,
                    })
                  }
                  style={S.input}
                >
                  <option value="">
                    Zgjidh furnitorin...
                  </option>

                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.emertimi}
                    </option>
                  ))}
                </select>
              </div>

              {/* FLOWER */}

              <div style={{ marginBottom: "15px" }}>
                <label style={S.label}>
                  Lulja / Produkti
                </label>

                <select
                  value={form.flowerId}
                  onChange={handleFlowerChange}
                  style={S.input}
                >
                  <option value="">
                    Zgjidh lulen...
                  </option>

                  {flowers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.emertimi}
                    </option>
                  ))}
                </select>
              </div>

              {/* QTY + COST */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "15px",
                }}
              >
                <div>
                  <label style={S.label}>Sasia</label>

                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        quantity: e.target.value,
                      })
                    }
                    placeholder="njësi"
                    style={S.input}
                  />
                </div>

                <div>
                  <label style={S.label}>
                    Kosto Njësi (€)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    value={form.unitCost}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        unitCost: e.target.value,
                      })
                    }
                    style={S.input}
                  />
                </div>
              </div>

              {/* DATE */}

              <div style={{ marginBottom: "15px" }}>
                <label style={S.label}>
                  Data e Porosisë
                </label>

                <input
                  type="date"
                  value={form.orderDate}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      orderDate: e.target.value,
                    })
                  }
                  style={S.input}
                />
              </div>

              {/* STATUS */}

              <div style={{ marginBottom: "25px" }}>
                <label style={S.label}>Statusi</label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                  style={S.input}
                >
                  {Object.entries(STATUS_MAP).map(
                    ([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "#2B1A4A",
                  color: "#FFF",
                  padding: "12px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Dërgo Porosinë
              </button>
            </form>
          </div>

          {/* TABLE */}

          <div
            style={{
              background: "#FFF",
              border: "1px solid #E6E0D8",
              overflowX: "auto",
            }}
          >
            {loading ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                }}
              >
                Duke ngarkuar...
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#2B1A4A",
                      color: "#FFF",
                    }}
                  >
                    {[
                      "ID",
                      "Furnitori",
                      "Totali",
                      "Data",
                      "Statusi",
                      "Veprime",
                    ].map((h) => (
                      <th key={h} style={S.th}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          padding: "40px",
                          textAlign: "center",
                        }}
                      >
                        Nuk ka porosi.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => {
                      const st =
                        STATUS_MAP[o.statusi] ||
                        STATUS_MAP.PENDING;

                      return (
                        <tr key={o.id}>
                          <td style={S.td}>
                            #{o.id}
                          </td>

                          <td style={S.td}>
                            {o.supplierName}
                          </td>

                          <td style={S.td}>
                            €
                            {Number(
                              o.shumaTotale || 0
                            ).toFixed(2)}
                          </td>

                          <td style={S.td}>
                            {o.dataPorosis}
                          </td>

                          <td style={S.td}>
                            <span
                              style={{
                                padding: "4px 8px",
                                fontSize: "11px",
                                fontWeight: "700",
                                textTransform:
                                  "uppercase",
                                background:
                                  st.background,
                                color: st.color,
                              }}
                            >
                              {st.label}
                            </span>
                          </td>

                          <td style={S.td}>
                            <button
                              onClick={() =>
                                handleDelete(o.id)
                              }
                              style={{
                                background:
                                  "transparent",
                                color: "#C0392B",
                                border:
                                  "1px solid #C0392B",
                                padding: "4px 10px",
                                cursor: "pointer",
                              }}
                            >
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

export default SupplyOrdersCRUD;