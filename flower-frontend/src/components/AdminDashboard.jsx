import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    flowersInStock: 0,
    monthlyRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const cards = [
    { title: "Flowers Stock", desc: "Menaxho lulet, stoket dhe çmimet.", path: "/flowers", tag: "Core Inventory" },
    { title: "Bouquet Flowers", desc: "Ndërtimi i buqetave.", path: "/bouquets", tag: "Composition" },
    { title: "Orders Registry", desc: "Menaxho porositë e klientëve.", path: "/admin/orders-registry", tag: "Sales Control" },
    { title: "Customers Matrix", desc: "Menaxho profilet e klientëve.", path: "/customers", tag: "CRM Accounts" },
    { title: "Categories", desc: "Kategorizimi i produkteve.", path: "/categories", tag: "Store Structure" },
    { title: "Inventory Log", desc: "Gjendja e magazinës.", path: "/inventory", tag: "Logistics" },
    { title: "Payments & Invoices", desc: "Faturat dhe transaksionet.", path: "/payments", tag: "Financials" },
    { title: "Suppliers Portal", desc: "Menaxhimi i furnitorëve.", path: "/suppliers", tag: "Supply Chain" },
    { title: "Deliveries Hub", desc: "Monitorimi i dërgesave.", path: "/deliveries", tag: "Distribution" },
    { title: "Client Reviews", desc: "Moderimi i feedback-ut.", path: "/reviews", tag: "Moderation" },
    { title: "Occasions", desc: "Menaxho rastet dhe ngjarjet speciale.", path: "/occasions", tag: "Event Management" }
  ];

  useEffect(() => {
    fetchRealtimeMetrics();
  }, []);

  const fetchRealtimeMetrics = async () => {
    setLoading(true);

    try {
      const ordersRes = await axios.get("http://localhost:8080/api/orders")
        .catch(() => ({
          data: JSON.parse(localStorage.getItem("orders")) || [],
        }));

      const flowersRes = await axios.get("http://localhost:8080/api/flowers")
        .catch(() => ({ data: [] }));

      const orders = ordersRes.data || [];
      const flowers = flowersRes.data || [];

      // ✅ MONTHLY REVENUE FIX (siç e do)
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlyOrders = orders.filter((o) => {
        const d = new Date(o.data_porosise || o.dataPorosise);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      const monthlyRevenue = monthlyOrders.reduce(
        (sum, o) =>
          sum + parseFloat(o.shume_totale || o.totalRevenue || o.totalPrice || 0),
        0
      );

      setStats({
        totalOrders: orders.length,
        flowersInStock: flowers.length || 58,
        monthlyRevenue,
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#FAF8F5",
      padding: "50px 6%",
      fontFamily: "system-ui, sans-serif",
      color: "#1F1F1F"
    }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* HEADER (SI E KE PAS) */}
        <div style={{
          borderBottom: "1px solid #E6E0D8",
          paddingBottom: "30px",
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }}>
          <div>
            <h1 style={{ fontSize: "42px", fontFamily: "Georgia, serif", color: "#2B1A4A" }}>
              Administrative Panel
            </h1>
            <p style={{ color: "#666", marginTop: "10px" }}>
            
              Monitoroni performancën e dyqanit dhe menaxhoni logjistikën.
            </p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        {/* QUICK ACTIONS (FIXED + PROFESSIONAL BUTTONS) */}
<div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px"
}}>
  
  {/* LEFT BUTTONS */}
  <div style={{ display: "flex", gap: "12px" }}>
    
    <Link
      to="/flowers"
      style={{
        padding: "10px 18px",
        background: "#2B1A4A",
        color: "#FFF",
        textDecoration: "none",
        fontSize: "12px",
        fontWeight: "600",
        borderRadius: "6px",
        letterSpacing: "0.5px",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(43,26,74,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      + SHTO LULE
    </Link>

    <Link
      to="/orders"
      style={{
        padding: "10px 18px",
        background: "#0E5A5B",
        color: "#FFF",
        textDecoration: "none",
        fontSize: "12px",
        fontWeight: "600",
        borderRadius: "6px",
        letterSpacing: "0.5px",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 18px rgba(14,90,91,0.25)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      + POROSI E RE
    </Link>

  </div>

  {/* RIGHT BUTTON */}
  <button
    onClick={fetchRealtimeMetrics}
    style={{
      padding: "10px 16px",
      background: "transparent",
      border: "1px solid #0E5A5B",
      color: "#0E5A5B",
      fontSize: "12px",
      fontWeight: "600",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#0E5A5B";
      e.currentTarget.style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "#0E5A5B";
    }}
  >
    ↻ Rifresko të dhënat
  </button>

</div>

        {/* STATS (SI E KE PAS) */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
          {[
            { l: "Total Porosi", v: stats.totalOrders },
            { l: "Stoku", v: stats.flowersInStock },
            { l: "Xhiro Mujore", v: `€${stats.monthlyRevenue.toFixed(2)}` },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "#FFF", padding: "20px" }}>
              <span style={{ fontSize: "10px", textTransform: "uppercase", color: "#888" }}>
                {s.l}
              </span>
              <h2 style={{ fontSize: "28px", color: "#2B1A4A", margin: "5px 0" }}>
                {loading ? "..." : s.v}
              </h2>
            </div>
          ))}
        </div>

        {/* CARDS (SI E KE PAS) */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {cards.map((card, i) => (
            <Link key={i} to={card.path} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ background: "#FFF", border: "1px solid #E6E0D8", padding: "25px" }}>
                <span style={{ fontSize: "10px", color: "#0E5A5B", fontWeight: "700" }}>
                  {card.tag}
                </span>
                <h3 style={{ fontSize: "18px", color: "#2B1A4A", margin: "10px 0" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#777" }}>
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;