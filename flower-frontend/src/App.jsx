import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { FaEnvelope, FaInstagram, FaPhoneAlt } from "react-icons/fa";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import UsersCRUD        from "./components/UsersCRUD";
import OrderItemsCRUD   from "./components/OrderItemsCRUD";
import SupplyOrdersCRUD from "./components/SupplyOrdersCRUD";



const CartPage = lazy(() => import("./pages/CartPage"));
const AboutUs = lazy(() => import("./components/AboutUs.jsx"));
const Flowers = lazy(() => import("./components/Flowers"));
const Bouquets = lazy(() => import("./components/Bouquets"));
const Occasions = lazy(() => import("./components/Occasions"));
const Reviews = lazy(() => import("./components/Reviews"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const FlowerStore = lazy(() => import("./components/FlowerStore"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const FlowerCRUD = lazy(() => import("./components/FlowerCRUD"));
const BouquetCRUD = lazy(() => import("./components/BouquetCRUD"));
const OccasionCRUD = lazy(() => import("./components/OccasionCRUD"));
const SupplierCRUD = lazy(() => import("./components/SupplierCRUD"));
const OrderPage = lazy(() => import("./components/OrderPage"));
const OrderCRUD = lazy(() => import("./components/OrderCRUD"));
const CategoriesCRUD = lazy(() => import("./components/CategoriesCRUD"));
const InventoryCRUD = lazy(() => import("./components/InventoryCRUD"));
const OrderDetails = lazy(() => import("./components/OrderDetails"));
const PaymentsCrud = lazy(() => import("./components/PaymentsCrud"));
const CustomerCRUD = lazy(() => import("./components/CustomerCRUD"));
const DeliveriesCRUD = lazy(() => import("./components/DeliveriesCRUD.jsx"));
const ReviewsCRUD = lazy(() => import("./components/ReviewsCRUD"));
const UserBouquetCrud = lazy(() => import("./components/UserBouquetCRUD.jsx"));

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
      <p style={{ fontSize: "14px", marginBottom: "15px", lineHeight: "1.6"}}>
      Jemi këtu për t'ju ndihmuar me çdo pyetje apo nevojë për dekorim. Na kontaktoni për çdo porosi ose paqartësi.
      </p>
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

      <Suspense fallback={<div style={{padding:"40px", textAlign:"center"}}>Loading...</div>}>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/"         element={<PrivateRoute><FlowerStore /></PrivateRoute>} />
        <Route path="/about"    element={<AboutUs />} />

        <Route path="/user/flowers"   element={<Flowers />} />
        <Route path="/user/bouquets"  element={<Bouquets />} />
        <Route path="/user/occasions" element={<Occasions />} />
        <Route path="/user/reviews"   element={<Reviews />} />
        <Route path="/user/bouquet-crud"  element={<UserBouquetCrud />} />
        <Route path="/users"         element={<UsersCRUD />} />
<Route path="/order-items"   element={<OrderItemsCRUD />} />
<Route path="/supply-orders" element={<SupplyOrdersCRUD />} />


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
      </Suspense>

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