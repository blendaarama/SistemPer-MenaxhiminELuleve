import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import FlowerStore from './components/FlowerStore';
import FlowerCRUD from './components/FlowerCRUD';
import BouquetCRUD from './components/BouquetCRUD';
import OccasionCRUD from './components/OccasionCRUD';
import SupplierCRUD from './components/SupplierCRUD';
import OrderPage from './components/OrderPage';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top">
          <div className="container">
            <Link className="navbar-brand" to="/">Eternal Rose</Link>
            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/login">Login</Link>
            </div>
          </div>
        </nav>

        <main className="py-4">
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<FlowerStore />} />
              
              <Route path="/flowers" element={<PrivateRoute><FlowerCRUD /></PrivateRoute>} />
              <Route path="/bouquets" element={<PrivateRoute><BouquetCRUD /></PrivateRoute>} />
              <Route path="/occasions" element={<PrivateRoute><OccasionCRUD /></PrivateRoute>} />
              <Route path="/suppliers" element={<PrivateRoute><SupplierCRUD /></PrivateRoute>} />
              <Route path="/order" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>

        <footer className="text-center py-4 mt-5 text-muted small border-top bg-white">
          &copy; 2026 <strong>Eternal Rose</strong>
        </footer>
      </div>
    </Router>
  );
}

export default App;