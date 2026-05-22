import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/porosi");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel/delete this order?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/porosi/${id}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // Funksion ndihmës për të stiluar statuset në mënyrë elegante (si aplikacionet premium)
  const getStatusStyle = (status) => {
    const currentStatus = String(status).toUpperCase();
    if (currentStatus.includes("DELIVERED") || currentStatus.includes("KRYER") || currentStatus.includes("PAID")) {
      return { backgroundColor: "#E8F5F1", color: "#0E5A5B" }; // E gjelbër e butë
    }
    if (currentStatus.includes("PENDING") || currentStatus.includes("PRITJE")) {
      return { backgroundColor: "#FFF4D4", color: "#B07D00" }; // E verdhë e butë
    }
    if (currentStatus.includes("CANCEL") || currentStatus.includes("REFUZ")) {
      return { backgroundColor: "#FFEAEA", color: "#FF8E8E" }; // E kuqe e butë
    }
    return { backgroundColor: "#FAF8F5", color: "#1F1F1F" }; // Standard
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

        {/* ORDERS TABLE CONTAINER */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
          <table 
            className="table m-0 table-hover" 
            style={{ 
              width: "100%", 
              borderCollapse: "collapse", 
              fontSize: "14px"
            }}
          >
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
                      
                      {/* ID */}
                      <td style={{ padding: "18px 20px", fontWeight: "600", color: "#0E5A5B" }}>
                        #{o.id}
                      </td>
                      
                      {/* KLIENTI */}
                      <td style={{ padding: "18px 20px", fontWeight: "500" }}>
                        {o.klienti?.emri || "Guest User"}
                      </td>
                      
                      {/* DATA */}
                      <td style={{ padding: "18px 20px", color: "#6E6A66" }}>
                        {o.dataPorosise ? new Date(o.dataPorosise).toLocaleDateString() : "—"}
                      </td>
                      
                      {/* ADRESA */}
                      <td style={{ padding: "18px 20px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {o.adresaDorezimit || "—"}
                      </td>
                      
                      {/* SHUMA */}
                      <td style={{ padding: "18px 20px", fontWeight: "700", fontFamily: "Georgia, serif", fontSize: "15px" }}>
                        {o.shumeTotale?.toFixed(2) || "0.00"} €
                      </td>
                      
                      {/* STATUSI AS BADGE */}
                      <td style={{ padding: "18px 20px", textAlign: "center" }}>
                        <span 
                          style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            borderRadius: "0px", // Këndet e mprehta
                            ...statusStyle
                          }}
                        >
                          {o.statusi || "Unknown"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td style={{ padding: "18px 20px", textAlign: "center" }}>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleDelete(o.id)}
                          style={{
                            background: "transparent",
                            color: "#FF8E8E",
                            border: "1px solid #FF8E8E",
                            borderRadius: "0px",
                            fontSize: "11px",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            padding: "6px 14px",
                            fontWeight: "600",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#FF8E8E";
                            e.currentTarget.style.color = "#FFFFFF";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#FF8E8E";
                          }}
                        >
                          Delete
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default OrderPage;