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
import PrivateRoute from './components/PrivateRoute';
import CustomerCRUD from './components/CustomerCRUD';
import DeliveriesCRUD from './components/DeliveriesCRUD';
import ReviewsCRUD from './components/ReviewsCRUD';

// 1. Krijojmë komponentin e përmbajtjes që ka qasje te useLocation()
function AppContent() {
  const location = useLocation();
  
  // Kontrollojmë nëse përdoruesi është te faqja e login-it
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#FAF8F5' }}>

      {/* NAVBAR: Shfaqet vetëm nëse nuk jemi në Login */}
      {!isLoginPage && <Navbar />}

      {/* MAIN CONTENT: Hoqëm klasat container që të mos krijojnë hapësirë të bardhë anash */}
      <main>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
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

      {/* FOOTER: Shfaqet vetëm nëse nuk jemi në Login */}
      {!isLoginPage && (
        <footer className="text-center py-4 mt-5 text-muted small border-top bg-white">
          &copy; 2026 <strong>Eternal Rose</strong>
        </footer>
      )}

    </div>
  );
}

// 2. Komponenti kryesor që thjesht mbështjell gjithçka me Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;