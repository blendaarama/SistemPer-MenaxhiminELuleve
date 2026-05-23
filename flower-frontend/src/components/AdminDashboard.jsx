import React from "react";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Flowers",
    desc: "Menaxho lulet, stokun dhe çmimet",
    path: "/flowers",
    icon: "🌹",
    color: "#d63384",
  },
  {
    title: "Bouquet Flowers",
    desc: "Lidh lulet me buqetat",
    path: "/bouquet-flowers",
    icon: "💐",
    color: "#8b5cf6",
  },
  {
    title: "Orders",
    desc: "Shiko dhe menaxho porositë",
    path: "/order",
    icon: "🛒",
    color: "#0ea5e9",
  },
  {
    title: "Customers",
    desc: "Menaxho klientët",
    path: "/customers",
    icon: "👤",
    color: "#10b981",
  },
  {
    title: "Categories",
    desc: "Kategoritë e produkteve",
    path: "/categories",
    icon: "📂",
    color: "#f59e0b",
  },
  {
    title: "Inventory",
    desc: "Kontrollo inventarin",
    path: "/inventory",
    icon: "📦",
    color: "#ef4444",
  },
  {
    title: "Payments",
    desc: "Pagesat dhe faturat",
    path: "/payments",
    icon: "💳",
    color: "#14b8a6",
  },
  {
    title: "Suppliers",
    desc: "Menaxho furnitorët",
    path: "/suppliers",
    icon: "🚚",
    color: "#6366f1",
  },
];

const AdminDashboard = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071e16",
        padding: "50px 6%",
        color: "white",
      }}
    >
      {/* TOP */}
      <div className="mb-5">
        <p
          style={{
            color: "#9fb8ad",
            letterSpacing: "3px",
            fontSize: "13px",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Eternal Rose Admin
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontFamily: "serif",
            marginBottom: "10px",
          }}
        >
          Dashboard
        </h1>

        <p style={{ color: "#b7c8c0", maxWidth: "600px" }}>
          Menaxho produktet, porositë, klientët dhe inventarin nga një panel modern.
        </p>
      </div>

      {/* STATS */}
      <div
        className="row g-4 mb-5"
      >
        <div className="col-md-4">
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "24px",
              padding: "30px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h2 style={{ fontSize: "42px", marginBottom: "10px" }}>124</h2>
            <p style={{ color: "#b7c8c0", margin: 0 }}>Total Orders</p>
          </div>
        </div>

        <div className="col-md-4">
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "24px",
              padding: "30px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h2 style={{ fontSize: "42px", marginBottom: "10px" }}>58</h2>
            <p style={{ color: "#b7c8c0", margin: 0 }}>Flowers In Stock</p>
          </div>
        </div>

        <div className="col-md-4">
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              borderRadius: "24px",
              padding: "30px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <h2 style={{ fontSize: "42px", marginBottom: "10px" }}>€8.4K</h2>
            <p style={{ color: "#b7c8c0", margin: 0 }}>Monthly Revenue</p>
          </div>
        </div>
      </div>

      {/* MODULES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "24px",
        }}
      >
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.path}
            style={{
              textDecoration: "none",
              color: "white",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: "28px",
                padding: "30px",
                height: "100%",
                transition: "0.3s",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.04)";
              }}
            >
              <div
                style={{
                  width: "62px",
                  height: "62px",
                  borderRadius: "18px",
                  background: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  marginBottom: "22px",
                }}
              >
                {card.icon}
              </div>

              <h3
                style={{
                  fontSize: "24px",
                  marginBottom: "10px",
                  fontFamily: "serif",
                }}
              >
                {card.title}
              </h3>

              <p
                style={{
                  color: "#b7c8c0",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                }}
              >
                {card.desc}
              </p>

              <span
                style={{
                  color: "#d7e6df",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Open Module →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;