import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/order-items";
const ORDERS_API = "http://localhost:8080/api/orders";
const FLOWERS_API = "http://localhost:8080/api/flowers";
const BOUQUETS_API = "http://localhost:8080/api/bouquets";

const initialForm = {
  id: null,
  orderId: "",
  productType: "FLOWER",
  flowerId: "",
  bouquetId: "",
  quantity: 1,
  unitPrice: "",
};

const OrderItemsCRUD = () => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [bouquets, setBouquets] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchItems();
    fetchOrders();

    axios
      .get(FLOWERS_API)
      .then((res) => setFlowers(res.data || []))
      .catch(() => {});

    axios
      .get(BOUQUETS_API)
      .then((res) => setBouquets(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    console.log("ORDERS:", orders);
  }, [orders]);

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);

      setItems(
        Array.isArray(res.data)
          ? res.data
          : res.data?.content || []
      );
    } catch (err) {
      console.log(err);

      const local = JSON.parse(
        localStorage.getItem("orderItems") || "[]"
      );

      setItems(local);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(ORDERS_API);

      console.log("ORDERS RESPONSE:", res.data);

      setOrders(
        Array.isArray(res.data)
          ? res.data
          : res.data?.content || []
      );
    } catch (err) {
      console.log(err);

      const local = JSON.parse(
        localStorage.getItem("orders") || "[]"
      );

      setOrders(local);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.orderId) {
      setError("Porosia është e detyrueshme.");
      return;
    }

    if (
      form.productType === "FLOWER" &&
      !form.flowerId
    ) {
      setError("Zgjidh lulen.");
      return;
    }

    if (
      form.productType === "BOUQUET" &&
      !form.bouquetId
    ) {
      setError("Zgjidh buqetën.");
      return;
    }

    setError("");

    let payload = {
      id: form.id || Date.now(),
      orderId: Number(form.orderId),
      productType: form.productType,
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
    };

    if (form.productType === "FLOWER") {
      const flower = flowers.find(
        (f) => String(f.id) === String(form.flowerId)
      );

      payload.flowerId = Number(form.flowerId);
      payload.flowerName = flower?.emertimi || "";
    }

    if (form.productType === "BOUQUET") {
      const bouquet = bouquets.find(
        (b) => String(b.id) === String(form.bouquetId)
      );

      payload.bouquetId = Number(form.bouquetId);
      payload.bouquetName = bouquet?.emertimi || "";
    }

    try {
      if (form.id) {
        await axios.put(
          `${API_URL}/${form.id}`,
          payload
        );
      } else {
        await axios.post(API_URL, payload);
      }

      fetchItems();
    } catch {
      const local = JSON.parse(
        localStorage.getItem("orderItems") || "[]"
      );

      const updated = form.id
        ? local.map((i) =>
            i.id === form.id ? payload : i
          )
        : [...local, payload];

      localStorage.setItem(
        "orderItems",
        JSON.stringify(updated)
      );

      setItems(updated);
    }

    setForm(initialForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt?")) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch {
      const updated = items.filter(
        (i) => i.id !== id
      );

      localStorage.setItem(
        "orderItems",
        JSON.stringify(updated)
      );
    }

    setItems((prev) =>
      prev.filter((i) => i.id !== id)
    );
  };

  const handleEdit = (item) => {
    setForm({
      ...item,
      orderId: String(item.orderId || ""),
      flowerId: String(item.flowerId || ""),
      bouquetId: String(item.bouquetId || ""),
    });

    window.scrollTo(0, 0);
  };

  const grandTotal = items.reduce(
    (sum, i) =>
      sum +
      Number(i.quantity || 0) *
        Number(i.unitPrice || 0),
    0
  );

  return (
    <div
      style={{
        background: "#FAF8F5",
        minHeight: "100vh",
        padding: "40px 6%",
        fontFamily: "system-ui",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "40px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "20px",
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
              Sales Detail
            </span>

            <h2
              style={{
                color: "#2B1A4A",
                fontSize: "42px",
                fontFamily: "Georgia",
              }}
            >
              Detajet e Zërave të Porosive
            </h2>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "13px",
                color: "#777",
              }}
            >
              VLERA TOTALE E ZËRAVE
            </div>

            <div
              style={{
                fontSize: "38px",
                color: "#2B1A4A",
                fontWeight: "bold",
              }}
            >
              €{grandTotal.toFixed(2)}
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#ffebee",
              padding: "10px",
              marginBottom: "20px",
              color: "red",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "40px",
          }}
        >
          {/* FORM */}

          <div
            style={{
              background: "#fff",
              padding: "30px",
              border: "1px solid #ddd",
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
              }}
            >
              Shto Zë Porosie
            </h3>

            <form onSubmit={handleSubmit}>
              {/* ORDER */}

              <select
                value={form.orderId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    orderId: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                }}
              >
                <option value="">
                  Zgjidh Porosinë
                </option>

                {orders.map((o, index) => (
                  <option
                    key={
                      o.id ||
                      o.orderId ||
                      index
                    }
                    value={o.id || o.orderId}
                  >
                    Porosia #
                    {o.id || o.orderId}
                  </option>
                ))}
              </select>

              {/* PRODUCT TYPE */}

              <select
                value={form.productType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    productType: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                }}
              >
                <option value="FLOWER">
                  Lule
                </option>

                <option value="BOUQUET">
                  Buqetë
                </option>
              </select>

              {/* FLOWERS */}

              {form.productType ===
                "FLOWER" && (
                <select
                  value={form.flowerId}
                  onChange={(e) => {
                    const flower =
                      flowers.find(
                        (f) =>
                          String(f.id) ===
                          e.target.value
                      );

                    setForm({
                      ...form,
                      flowerId:
                        e.target.value,
                      unitPrice:
                        flower?.cmimi || "",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <option value="">
                    Zgjidh Lulen
                  </option>

                  {flowers.map((f) => (
                    <option
                      key={f.id}
                      value={f.id}
                    >
                      {f.emertimi}
                    </option>
                  ))}
                </select>
              )}

              {/* BOUQUETS */}

              {form.productType ===
                "BOUQUET" && (
                <select
                  value={form.bouquetId}
                  onChange={(e) => {
                    const bouquet =
                      bouquets.find(
                        (b) =>
                          String(b.id) ===
                          e.target.value
                      );

                    setForm({
                      ...form,
                      bouquetId:
                        e.target.value,
                      unitPrice:
                        bouquet?.cmimi || "",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "15px",
                  }}
                >
                  <option value="">
                    Zgjidh Buqetën
                  </option>

                  {bouquets.map((b) => (
                    <option
                      key={b.id}
                      value={b.id}
                    >
                      {b.emertimi}
                    </option>
                  ))}
                </select>
              )}

              {/* QUANTITY */}

              <input
                type="number"
                min="1"
                placeholder="Sasia"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                }}
              />

              {/* PRICE */}

              <input
                type="number"
                step="0.01"
                placeholder="Çmimi"
                value={form.unitPrice}
                onChange={(e) =>
                  setForm({
                    ...form,
                    unitPrice: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "20px",
                }}
              />

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "#2B1A4A",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {form.id
                  ? "Përditëso"
                  : "Shto Zërin"}
              </button>
            </form>
          </div>

          {/* TABLE */}

          <div
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#2B1A4A",
                    color: "white",
                  }}
                >
                  <th style={{ padding: 12 }}>
                    ID
                  </th>
                  <th>Porosia</th>
                  <th>Produkti</th>
                  <th>Sasia</th>
                  <th>Çmimi</th>
                  <th>Totali</th>
                  <th>Veprime</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        padding: 12,
                      }}
                    >
                      #{item.id}
                    </td>

                    <td>
                      #
                      {item.orderId ||
                        item.order?.id}
                    </td>

                    <td>
                      {item.productType ===
                      "FLOWER"
                        ? item.flowerName
                        : item.bouquetName}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      €
                      {Number(
                        item.unitPrice || 0
                      ).toFixed(2)}
                    </td>

                    <td>
                      €
                      {(
                        Number(
                          item.quantity || 0
                        ) *
                        Number(
                          item.unitPrice || 0
                        )
                      ).toFixed(2)}
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleEdit(item)
                        }
                        style={{
                          marginRight: 5,
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        Fshij
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsCRUD;