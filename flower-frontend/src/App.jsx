import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { FaEnvelope, FaInstagram, FaPhoneAlt } from "react-icons/fa";

import CartPage from "./pages/CartPage";
import AboutUs from "./components/AboutUs.jsx";
import Flowers from "./components/Flowers";
import Bouquets from "./components/Bouquets";
import Occasions from "./components/Occasions";
import Reviews from "./components/Reviews";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import FlowerStore from "./components/FlowerStore";
import SearchResults from "./pages/SearchResults";
import AdminDashboard from "./components/AdminDashboard";
import FlowerCRUD from "./components/FlowerCRUD";
import BouquetCRUD from "./components/BouquetCRUD";
import OccasionCRUD from "./components/OccasionCRUD";
import SupplierCRUD from "./components/SupplierCRUD";
import OrderPage from "./components/OrderPage";
import OrderCRUD from "./components/OrderCRUD";
import CategoriesCRUD from "./components/CategoriesCRUD";
import InventoryCRUD from "./components/InventoryCRUD";
import OrderDetails from "./components/OrderDetails";
import PaymentsCrud from "./components/PaymentsCrud";
import CustomerCRUD from "./components/CustomerCRUD";
import DeliveriesCRUD from "./components/DeliveriesCRUD.jsx";
import ReviewsCRUD from "./components/ReviewsCRUD";
import PrivateRoute from "./components/PrivateRoute";

const AppFooter = () => (
  <footer style={{ background: "#2B1A4A", color: "#FFFFFF", padding: "60px 10%", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "80px", marginTop: "auto" }}>
    <div style={{ flex: "1 1 400px" }}>
      <h3 style={{ color: "white", marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>About Us</h3>
      <p style={{ fontSize: "14px", lineHeight: "1.6", marginBottom: "20px", opacity: 0.9, textAlign: "justify" }}>
        Eternal Rose është lider në aranzhimin e luleve. Ne sjellim freski dhe elegancë në çdo moment tuajin.
      </p>
      <Link to="/about" style={{ display: "inline-block", padding: "10px 25px", background: "#0E5A5B", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "14px", fontWeight: "bold" }}>
        Learn More
      </Link>
    </div>
    <div style={{ flex: "1 1 400px" }}>
      <h3 style={{ color: "white", marginBottom: "20px", fontSize: "20px", fontWeight: "bold" }}>Contact Us</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaEnvelope color="#0E5A5B" />
          <a href="mailto:eternalrose@gmail.com" style={{ color: "white", textDecoration: "none" }}>eternalrose@gmail.com</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaInstagram color="#0E5A5B" /> <span>@EternalRose</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaPhoneAlt color="#0E5A5B" /> <span>+383 44 453 821</span>
        </div>
      </div>
    </div>
  </footer>
);

function AppContent() {
  const location = useLocation();
  const isAuth = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuth && <Navbar />}

      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/"         element={<PrivateRoute><FlowerStore /></PrivateRoute>} />
        <Route path="/about"    element={<AboutUs />} />

        <Route path="/user/flowers"   element={<Flowers />} />
        <Route path="/user/bouquets"  element={<Bouquets />} />
        <Route path="/user/occasions" element={<Occasions />} />
        <Route path="/user/reviews"   element={<Reviews />} />

        <Route path="/order" element={<PrivateRoute><CartPage /></PrivateRoute>} />

        {/* ADMIN */}
        <Route path="/admin/dashboard"        element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/orders-registry"  element={<PrivateRoute adminOnly><OrderCRUD /></PrivateRoute>} />

        <Route path="/flowers"       element={<PrivateRoute adminOnly><FlowerCRUD /></PrivateRoute>} />
        <Route path="/bouquets"      element={<PrivateRoute adminOnly><BouquetCRUD /></PrivateRoute>} />
        <Route path="/occasions"     element={<PrivateRoute adminOnly><OccasionCRUD /></PrivateRoute>} />
        <Route path="/suppliers"     element={<PrivateRoute adminOnly><SupplierCRUD /></PrivateRoute>} />
        <Route path="/orders"        element={<PrivateRoute adminOnly><OrderPage /></PrivateRoute>} />
        <Route path="/order-details" element={<PrivateRoute adminOnly><OrderDetails /></PrivateRoute>} />
        <Route path="/payments"      element={<PrivateRoute adminOnly><PaymentsCrud /></PrivateRoute>} />
        <Route path="/customers"     element={<PrivateRoute adminOnly><CustomerCRUD /></PrivateRoute>} />
        <Route path="/inventory"     element={<PrivateRoute adminOnly><InventoryCRUD /></PrivateRoute>} />
        <Route path="/categories"    element={<PrivateRoute adminOnly><CategoriesCRUD /></PrivateRoute>} />
        <Route path="/deliveries"    element={<PrivateRoute adminOnly><DeliveriesCRUD /></PrivateRoute>} />
        <Route path="/reviews"       element={<PrivateRoute adminOnly><ReviewsCRUD /></PrivateRoute>} />

        <Route path="/search" element={<SearchResults />} />
        <Route path="*"       element={<Navigate to="/" />} />
      </Routes>

      {!isAuth && <AppFooter />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}