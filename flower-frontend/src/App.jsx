import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// COMPONENTS
import Navbar from './components/Navbar';
import FlowerStore from './components/FlowerStore';
import FlowerCRUD from './components/FlowerCRUD';
import BouquetFlowersCRUD from './components/BouquetFlowersCRUD';
import OccasionCRUD from './components/OccasionCRUD';
import SupplierCRUD from './components/SupplierCRUD';
import OrderPage from './components/OrderPage';
import CategoriesCRUD from './components/CategoriesCRUD';
import InventoryCRUD from './components/InventoryCRUD';

// FIXED IMPORTS
import OrderDetails from './components/OrderDetails';
import PaymentsCrud from './components/PaymentsCrud';
import SupplyOrders from './components/SupplyOrders';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import CustomerCRUD from './components/CustomerCRUD';
import DeliveriesCRUD from './components/DeliveriesCRUD';
import ReviewsCRUD from './components/ReviewsCRUD';

function AppContent() {
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#FAF8F5' }}>

      {/* NAVBAR: Shfaqet vetem nese nuk jemi ne Login ose Register */}
      {!isAuthPage && <Navbar />}

      <main>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* HOME PAGE - Dyqani i luleve ku redirect-ohet perdoruesi */}
          <Route path="/" element={<FlowerStore />} />

          {/* FLOWERS */}
          <Route path="/flowers" element={<PrivateRoute><FlowerCRUD /></PrivateRoute>} />
          <Route path="/bouquet-flowers" element={<PrivateRoute><BouquetFlowersCRUD /></PrivateRoute>} />

          {/* BUSINESS */}
          <Route path="/occasions" element={<PrivateRoute><OccasionCRUD /></PrivateRoute>} />
          <Route path="/suppliers" element={<PrivateRoute><SupplierCRUD /></PrivateRoute>} />

          {/* ORDERS */}
          <Route path="/order" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
          <Route path="/order-details" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute><PaymentsCrud /></PrivateRoute>} />
          <Route path="/supply-orders" element={<PrivateRoute><SupplyOrders /></PrivateRoute>} />

          {/* MANAGEMENT */}
          <Route path="/customers" element={<PrivateRoute><CustomerCRUD /></PrivateRoute>} />
          <Route path="/deliveries" element={<PrivateRoute><DeliveriesCRUD /></PrivateRoute>} />
          <Route path="/reviews" element={<PrivateRoute><ReviewsCRUD /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute><CategoriesCRUD /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute><InventoryCRUD /></PrivateRoute>} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* FOOTER: Shfaqet vetem nese nuk jemi ne Login ose Register */}
      {!isAuthPage && (
        <footer className="text-center py-4 mt-5 text-muted small border-top bg-white">
          &copy; 2026 <strong>Eternal Rose</strong>
        </footer>
      )}

    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;