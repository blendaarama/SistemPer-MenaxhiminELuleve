import React, { useEffect, useState } from "react";
import api from "../services/api.jsx";

const API_URL = "/api/payments";

const PaymentsCRUD = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(API_URL);
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gabim gjate marrjes se pagesave:", err.response?.data || err.message);
      setError("Nuk u ngarkuan pagesat. Duhet te jesh ADMIN ose STAFF.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A je e sigurt qe don me fshi kete pagese?")) return;

    try {
      await api.delete(`${API_URL}/${id}`);
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Gabim gjate fshirjes:", err.response?.data || err.message);
      setError("Nuk u fshi pagesa.");
    }
  };

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ color: "#2B1A4A", marginBottom: 6 }}>Payments / Pagesat</h2>
            <p style={{ margin: 0, color: "#777", fontSize: 14 }}>
              Pagesat krijohen automatikisht kur klienti ben porosi.
            </p>
          </div>

          <button
            onClick={fetchPayments}
            style={{
              background: "#2B1A4A",
              color: "white",
              border: 0,
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            Rifresko
          </button>
        </div>

        {error && (
          <div style={{ background: "#FFEAEA", color: "#C62828", padding: 12, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {loading ? (
          <p>Duke u ngarkuar...</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
            <thead>
              <tr style={{ background: "#2B1A4A", color: "white" }}>
                <th style={{ padding: 12, textAlign: "left" }}>ID</th>
                <th style={{ padding: 12, textAlign: "left" }}>Porosia ID</th>
                <th style={{ padding: 12, textAlign: "left" }}>Amount</th>
                <th style={{ padding: 12, textAlign: "left" }}>Method</th>
                <th style={{ padding: 12, textAlign: "left" }}>Status</th>
                <th style={{ padding: 12 }}>Veprime</th>
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: 25, textAlign: "center" }}>
                    Nuk ka te dhena.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: 12 }}>#{p.id || "—"}</td>
                    <td style={{ padding: 12 }}>#{p.porosia?.id || "—"}</td>
                    <td style={{ padding: 12 }}>{Number(p.amount || 0).toFixed(2)} €</td>
                    <td style={{ padding: 12 }}>{p.paymentMethod || "—"}</td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            p.status === "COMPLETED"
                              ? "#E8F5E9"
                              : p.status === "PENDING"
                              ? "#FFF3E0"
                              : "#FFEBEE",
                          color:
                            p.status === "COMPLETED"
                              ? "#2E7D32"
                              : p.status === "PENDING"
                              ? "#E65100"
                              : "#C62828",
                        }}
                      >
                        {p.status || "—"}
                      </span>
                    </td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <button onClick={() => handleDelete(p.id)} style={{ color: "#C62828" }}>
                        Fshij
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentsCRUD;