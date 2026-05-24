import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// PUBLIC
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import FlowerStore from "./components/FlowerStore";

// ADMIN
import AdminDashboard from "./components/AdminDashboard";

// CRUD
import FlowerCRUD from "./components/FlowerCRUD";
import BouquetFlowersCRUD from "./components/BouquetFlowersCRUD";
import OccasionCRUD from "./components/OccasionCRUD";
import SupplierCRUD from "./components/SupplierCRUD";
import OrderPage from "./components/OrderPage";
import CategoriesCRUD from "./components/CategoriesCRUD";
import InventoryCRUD from "./components/InventoryCRUD";
import OrderDetails from "./components/OrderDetails";
import PaymentsCrud from "./components/PaymentsCrud";
import SupplyOrders from "./components/SupplyOrders";
import CustomerCRUD from "./components/CustomerCRUD";
import DeliveriesCRUD from "./components/DeliveriesCRUD";
import ReviewsCRUD from "./components/ReviewsCRUD";

import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#FAF8F5" }}>

      {/* NAVBAR (SI VERSIONI YT) */}
      {!isAuthPage && <Navbar />}

      <main>
        <Routes>

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* HOME */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <FlowerStore />
              </PrivateRoute>
            }
          />

          {/* ADMIN DASHBOARD (ONLY ADMIN) */}
          <Route
  path="/admin/dashboard"
  element={
    <PrivateRoute adminOnly={true}>
      <AdminDashboard />
    </PrivateRoute>
  }
/>

          {/* CRUD - TANI TË MBROJTURA VETËM PËR ADMIN */}
          <Route path="/flowers" element={<PrivateRoute adminOnly={true}><FlowerCRUD /></PrivateRoute>} />
          <Route path="/bouquet-flowers" element={<PrivateRoute adminOnly={true}><BouquetFlowersCRUD /></PrivateRoute>} />
          <Route path="/occasions" element={<PrivateRoute adminOnly={true}><OccasionCRUD /></PrivateRoute>} />
          <Route path="/suppliers" element={<PrivateRoute adminOnly={true}><SupplierCRUD /></PrivateRoute>} />
          <Route path="/order" element={<PrivateRoute adminOnly={true}><OrderPage /></PrivateRoute>} />
          <Route path="/order-details" element={<PrivateRoute adminOnly={true}><OrderDetails /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute adminOnly={true}><PaymentsCrud /></PrivateRoute>} />
          <Route path="/supply-orders" element={<PrivateRoute adminOnly={true}><SupplyOrders /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute adminOnly={true}><CustomerCRUD /></PrivateRoute>} />
          <Route path="/deliveries" element={<PrivateRoute adminOnly={true}><DeliveriesCRUD /></PrivateRoute>} />
          <Route path="/reviews" element={<PrivateRoute adminOnly={true}><ReviewsCRUD /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute adminOnly={true}><CategoriesCRUD /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute adminOnly={true}><InventoryCRUD /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </main>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}