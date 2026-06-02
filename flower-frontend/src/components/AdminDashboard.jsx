import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    flowersInStock: 0,
    monthlyRevenue: 0,
    usersRegistered: 0,
  });

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [topFlowers, setTopFlowers] = useState([]);
  const [ordersChart, setOrdersChart] = useState([]);

  const cards = [
    { title: "Flowers Stock",       desc: "Menaxho lulet, stoket dhe çmimet.",          path: "/flowers",               tag: "Core Inventory"    },
    { title: "Bouquet Flowers",     desc: "Ndërtimi i buqetave.",                        path: "/bouquets",              tag: "Composition"       },
    { title: "Orders Registry",     desc: "Menaxho porositë e klientëve.",               path: "/admin/orders-registry", tag: "Sales Control"     },
    { title: "Customers Matrix",    desc: "Menaxho profilet e klientëve.",               path: "/customers",             tag: "CRM Accounts"      },
    { title: "Categories",          desc: "Kategorizimi i produkteve.",                  path: "/categories",            tag: "Store Structure"   },
    { title: "Inventory Log",       desc: "Gjendja e magazinës.",                        path: "/inventory",             tag: "Logistics"         },
    { title: "Payments & Invoices", desc: "Faturat dhe transaksionet.",                  path: "/payments",              tag: "Financials"        },
    { title: "Suppliers Portal",    desc: "Menaxhimi i furnitorëve.",                    path: "/suppliers",             tag: "Supply Chain"      },
    { title: "Deliveries Hub",      desc: "Monitorimi i dërgesave.",                     path: "/deliveries",            tag: "Distribution"      },
    { title: "Client Reviews",      desc: "Moderimi i feedback-ut.",                     path: "/reviews",               tag: "Moderation"        },
    { title: "Occasions",           desc: "Menaxho rastet dhe ngjarjet speciale.",       path: "/occasions",             tag: "Event Management"  },
    { title: "Order Items",         desc: "Detajet e zërave të çdo porosie.",            path: "/order-items",           tag: "Sales Detail"      },
    { title: "Supply Orders",       desc: "Porositë e blerjes nga furnitorët.",          path: "/supply-orders",         tag: "Procurement"       },
    { title: "System Users",        desc: "Llogari dhe roli i përdoruesve të sistemit.", path: "/users",                 tag: "Administration"    },
  ];

  useEffect(() => {
    fetchRealtimeMetrics();
  }, []);

  const fetchRealtimeMetrics = async () => {
    setLoading(true);

    try {
      const ordersRes = await axios
        .get("http://localhost:8080/api/porosi")
        .catch(() => ({ data: JSON.parse(localStorage.getItem("orders") || "[]") }));

      const flowersRes = await axios
        .get("http://localhost:8080/api/flowers")
        .catch(() => ({ data: [] }));

      const usersRes = await axios
        .get("http://localhost:8080/api/users")
        .catch(() => ({ data: [] }));

      const orders  = Array.isArray(ordersRes.data) ? ordersRes.data : (ordersRes.data?.content ?? []);
      const flowers = Array.isArray(flowersRes.data) ? flowersRes.data : (flowersRes.data?.content ?? []);
      const users   = Array.isArray(usersRes.data)   ? usersRes.data   : (usersRes.data?.content   ?? []);

      const now          = new Date();
      const currentMonth = now.getMonth();
      const currentYear  = now.getFullYear();

      const monthlyOrders = orders.filter((o) => {
        const d = new Date(o.dataPorosise || o.data_porosise);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      // ✅ RREGULLUAR — shumeTotale si prioritet i parë
      const monthlyRevenue = monthlyOrders.reduce(
        (sum, o) => sum + parseFloat(o.shumeTotale || o.shume_totale || o.totalRevenue || o.totalPrice || 0),
        0
      );

      setStats({
        totalOrders:     orders.length,
        flowersInStock:  flowers.length || 0,
        monthlyRevenue,
        usersRegistered: users.length || 0,
      });

      // REVENUE CHART — ✅ shumeTotale si prioritet
      const revenueMap = {};
      orders.forEach((o) => {
        const d     = new Date(o.dataPorosise || o.data_porosise);
        const month = d.toLocaleString("default", { month: "short" });
        if (!revenueMap[month]) revenueMap[month] = 0;
        revenueMap[month] += parseFloat(o.shumeTotale || o.shume_totale || o.totalRevenue || o.totalPrice || 0);
      });
      setChartData(Object.keys(revenueMap).map((m) => ({ month: m, revenue: revenueMap[m] })));

      // ORDERS CHART
      const orderMap = {};
      orders.forEach((o) => {
        const d     = new Date(o.dataPorosise || o.data_porosise);
        const month = d.toLocaleString("default", { month: "short" });
        if (!orderMap[month]) orderMap[month] = 0;
        orderMap[month]++;
      });
      setOrdersChart(Object.keys(orderMap).map((m) => ({ month: m, orders: orderMap[m] })));

      // TOP FLOWERS — nga statusi i porosive
      const statusMap = {};
      orders.forEach((o) => {
        const s = o.statusi || "PRITJE";
        if (!statusMap[s]) statusMap[s] = 0;
        statusMap[s]++;
      });
      setTopFlowers(Object.keys(statusMap).map((s) => ({ name: s, value: statusMap[s] })));

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const pieColors = ["#0E5A5B", "#2B1A4A", "#B76E79", "#D4A373", "#588157"];

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5", padding: "50px 6%", fontFamily: "system-ui, sans-serif", color: "#1F1F1F" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "30px", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "42px", fontFamily: "Georgia, serif", color: "#2B1A4A" }}>Administrative Panel</h1>
            <p style={{ color: "#666", marginTop: "10px" }}>Monitoroni performancën e dyqanit dhe menaxhoni logjistikën.</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "15px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link to="/flowers" style={{ padding: "12px 18px", background: "#2B1A4A", color: "#FFF", textDecoration: "none", fontSize: "12px", fontWeight: "600", borderRadius: "8px", letterSpacing: "0.5px" }}>
              + SHTO LULE
            </Link>
            <Link to="/orders" style={{ padding: "12px 18px", background: "#0E5A5B", color: "#FFF", textDecoration: "none", fontSize: "12px", fontWeight: "600", borderRadius: "8px", letterSpacing: "0.5px" }}>
              + POROSI E RE
            </Link>
          </div>
          <button onClick={fetchRealtimeMetrics} style={{ padding: "12px 18px", background: "#fff", border: "1px solid #0E5A5B", color: "#0E5A5B", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
            ↻ Rifresko të dhënat
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "20px", marginBottom: "40px" }}>
          {[
            { l: "Total Orders",      v: stats.totalOrders },
            { l: "Flowers Stock",     v: stats.flowersInStock },
            { l: "Monthly Revenue",   v: `€${stats.monthlyRevenue.toFixed(2)}` },
            { l: "Users Registered",  v: stats.usersRegistered },
          ].map((s, i) => (
            <div key={i} style={{ background: "#FFF", padding: "25px", borderRadius: "14px", border: "1px solid #E6E0D8", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
              <span style={{ fontSize: "11px", textTransform: "uppercase", color: "#888", letterSpacing: "1px" }}>{s.l}</span>
              <h2 style={{ fontSize: "32px", color: "#2B1A4A", marginTop: "10px" }}>{loading ? "..." : s.v}</h2>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))", gap: "24px", marginBottom: "50px" }}>

          {/* REVENUE */}
          <div style={{ background: "#FFF", padding: "25px", borderRadius: "14px", border: "1px solid #E6E0D8" }}>
            <h3 style={{ marginBottom: "20px", color: "#2B1A4A" }}>Revenue Analytics</h3>
            {chartData.length === 0 ? (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontStyle: "italic" }}>Nuk ka të dhëna ende</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => `€${v.toFixed(2)}`} />
                  <Line type="monotone" dataKey="revenue" stroke="#0E5A5B" strokeWidth={3} dot={{ fill: "#0E5A5B" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ORDERS */}
          <div style={{ background: "#FFF", padding: "25px", borderRadius: "14px", border: "1px solid #E6E0D8" }}>
            <h3 style={{ marginBottom: "20px", color: "#2B1A4A" }}>Monthly Orders</h3>
            {ordersChart.length === 0 ? (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontStyle: "italic" }}>Nuk ka të dhëna ende</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#2B1A4A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ORDER STATUS PIE */}
          <div style={{ background: "#FFF", padding: "25px", borderRadius: "14px", border: "1px solid #E6E0D8" }}>
            <h3 style={{ marginBottom: "20px", color: "#2B1A4A" }}>Statuset e Porosive</h3>
            {topFlowers.length === 0 ? (
              <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontStyle: "italic" }}>Nuk ka të dhëna ende</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={topFlowers} dataKey="value" nameKey="name" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                    {topFlowers.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* STORE PERFORMANCE */}
          <div style={{ background: "#FFF", padding: "25px", borderRadius: "14px", border: "1px solid #E6E0D8", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h3 style={{ marginBottom: "25px", color: "#2B1A4A" }}>Store Performance</h3>
            {[
              { label: "Total Revenue",       value: `€${stats.monthlyRevenue.toFixed(2)}` },
              { label: "Orders This Month",   value: stats.totalOrders },
              { label: "Inventory Health",    value: "Excellent" },
              { label: "Active Customers",    value: stats.usersRegistered },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: "18px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F0EDE8", paddingBottom: "12px" }}>
                <span style={{ color: "#666" }}>{item.label}</span>
                <strong style={{ color: "#2B1A4A" }}>{loading ? "..." : item.value}</strong>
              </div>
            ))}
            <div style={{ marginTop: "15px", background: "#E8F5F5", color: "#0E5A5B", padding: "12px", borderRadius: "8px", fontWeight: "600", textAlign: "center" }}>
              ✔ System running smoothly
            </div>
          </div>
        </div>

        {/* MODULE CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {cards.map((card, i) => (
            <Link key={i} to={card.path} style={{ textDecoration: "none", color: "inherit" }}>
              <div
                style={{ background: "#FFF", border: "1px solid #E6E0D8", padding: "25px", borderRadius: "14px", transition: "0.25s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: "10px", color: "#0E5A5B", fontWeight: "700", letterSpacing: "1px" }}>{card.tag}</span>
                <h3 style={{ fontSize: "20px", color: "#2B1A4A", margin: "12px 0" }}>{card.title}</h3>
                <p style={{ fontSize: "13px", color: "#777", lineHeight: "1.7" }}>{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;