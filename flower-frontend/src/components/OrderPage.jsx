import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/porosi";

const initialFormState = {
  id: null,
  klientiId: "", // Përdoret për të lidhur ID-në e klientit nga formulari
  adresaDorezimit: "",
  shumeTotale: "",
  statusi: "PRITJE"
};

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load commercial customer orders registry.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Përgatitja e payload-it sipas strukturës që pret Spring Boot
    const payload = {
      id: formData.id,
      adresaDorezimit: formData.adresaDorezimit,
      shumeTotale: parseFloat(formData.shumeTotale),
      statusi: formData.statusi,
      klienti: {
        id: parseInt(formData.klientiId)
      }
    };

    try {
      if (formData.id === null) {
        await axios.post(API_URL, payload);
      } else {
        await axios.put(`${API_URL}/${formData.id}`, payload);
      }
      resetForm();
      fetchOrders();
    } catch (err) {
      setError("Failed to commit order schema transaction to database.");
      console.error(err);
    }
  };

  const handleEdit = (order) => {
    setFormData({
      id: order.id,
      klientiId: order.klienti?.id || "",
      adresaDorezimit: order.adresaDorezimit || "",
      shumeTotale: order.shumeTotale || "",
      statusi: order.statusi || "PRITJE"
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel/delete this order?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchOrders();
    } catch (err) {
      setError("Failed to purge target order instance from database.");
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const getStatusStyle = (status) => {
    const currentStatus = String(status).toUpperCase();
    if (currentStatus.includes("DELIVERED") || currentStatus.includes("KRYER") || currentStatus.includes("PAID")) {
      return { backgroundColor: "#E8F5F1", color: "#0E5A5B" };
    }
    if (currentStatus.includes("PENDING") || currentStatus.includes("PRITJE")) {
      return { backgroundColor: "#FFF4D4", color: "#B07D00" };
    }
    if (currentStatus.includes("CANCEL") || currentStatus.includes("REFUZ")) {
      return { backgroundColor: "#FFEAEA", color: "#FF8E8E" };
    }
    return { backgroundColor: "#FAF8F5", color: "#1F1F1F" };
  };

  return (
    <div 
      style={{ 
        background: "#FAF8F5", 
        minHeight: "100vh", 
        padding: "40px 6%", 
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#1F1F1F"
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>
            Sales & Logistics
          </span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
            Customer Orders Overview
          </h2>
        </div>

        {/* ERROR ALERT BOX */}
        {error && (
          <div className="alert py-2 mb-4" style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1', fontSize: '13px', borderRadius: "0px" }}>
            {error}
          </div>
        )}

        {/* FORM CONTAINER (SHTUAR PËR CRUD TË PLOTË) */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px", marginBottom: "40px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", color: "#1F1F1F" }}>
            {formData.id ? "Modify Order Dispositions" : "Generate Custom Client Order Invoice"}
          </h4>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Customer ID Reference</label>
                <input type="number" name="klientiId" placeholder="e.g. 3" className="form-control" value={formData.klientiId} onChange={handleChange} required
                  style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
              </div>

              <div className="col-md-4 mb-3">
                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Total Revenue (€)</label>
                <input type="number" step="0.01" name="shumeTotale" placeholder="0.00" className="form-control" value={formData.shumeTotale} onChange={handleChange} required
                  style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
              </div>

              <div className="col-md-4 mb-3">
                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Order Status Pipeline</label>
                <select name="statusi" className="form-control" value={formData.statusi} onChange={handleChange} required
                  style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}>
                  <option value="PRITJE">PRITJE (PENDING)</option>
                  <option value="KRYER">KRYER (DELIVERED)</option>
                  <option value="REFUZUAR">REFUZUAR (CANCELLED)</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Delivery Destination Address</label>
              <input type="text" name="adresaDorezimit" placeholder="Street name, City, Zip" className="form-control" value={formData.adresaDorezimit} onChange={handleChange} required
                style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
            </div>

            <div style={{ marginTop: "20px" }}>
              <button type="submit" 
                style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px", transition: "background 0.15s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"} onMouseLeave={(e) => e.currentTarget.style.background = "#0E5A5B"}>
                {formData.id ? "Update Manifest" : "Process Invoice"}
              </button>

              <button type="button" onClick={resetForm}
                style={{ background: "transparent", color: "#1F1F1F", border: "1px solid #C4B9AF", padding: "11px 24px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1F1F1F"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#C4B9AF"; e.currentTarget.style.background = "transparent"; }}>
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* ORDERS TABLE CONTAINER */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Mapping transaction histories...</div>
        ) : (
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            <table className="table m-0 table-hover" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                  <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Order ID</th>
                  <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Customer</th>
                  <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Date</th>
                  <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Delivery Address</th>
                  <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Total Revenue</th>
                  <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                      No incoming orders available yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => {
                    const statusStyle = getStatusStyle(o.statusi);
                    return (
                      <tr key={o.id} style={{ borderBottom: "1px solid #E6E0D8", transition: "background 0.2s" }}>
                        <td style={{ padding: "18px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{o.id}</td>
                        <td style={{ padding: "18px 20px", fontWeight: "500" }}>{o.klienti?.emri ? `${o.klienti.emri} ${o.klienti.mbiemri || ""}` : "Guest User"}</td>
                        <td style={{ padding: "18px 20px", color: "#6E6A66" }}>{o.dataPorosise ? new Date(o.dataPorosise).toLocaleDateString() : "—"}</td>
                        <td style={{ padding: "18px 20px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.adresaDorezimit || "—"}</td>
                        <td style={{ padding: "18px 20px", fontWeight: "700", fontFamily: "Georgia, serif", fontSize: "15px" }}>{o.shumeTotale?.toFixed(2) || "0.00"} €</td>
                        <td style={{ padding: "18px 20px", textAlign: "center" }}>
                          <span style={{ display: "inline-block", padding: "6px 12px", fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px", textTransform: "uppercase", borderRadius: "0px", ...statusStyle }}>
                            {o.statusi || "Unknown"}
                          </span>
                        </td>
                        <td style={{ padding: "18px 20px", textAlign: "center" }}>
                          <div style={{ display: "flex", justifyContent: "center", gap: "6px" }}>
                            <button onClick={() => handleEdit(o)}
                              style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", fontWeight: "600", cursor: "pointer" }}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(o.id)}
                              style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", fontWeight: "600", transition: "all 0.2s" }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "#FF8E8E"; e.currentTarget.style.color = "#FFFFFF"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#FF8E8E"; }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default OrderPage;