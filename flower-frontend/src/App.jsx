import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';

// COMPONENTS
import Navbar from './components/Navbar';
import FlowerStore from './components/FlowerStore';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

// ALL CRUD PANELS
import FlowerCRUD from './components/FlowerCRUD';
import BouquetFlowersCRUD from './components/BouquetFlowersCRUD';
import OccasionCRUD from './components/OccasionCRUD';
import SupplierCRUD from './components/SupplierCRUD';
import OrderPage from './components/OrderPage';
import CategoriesCRUD from './components/CategoriesCRUD';
import InventoryCRUD from './components/InventoryCRUD';
import OrderDetails from './components/OrderDetails';
import PaymentsCrud from './components/PaymentsCrud';
import SupplyOrders from './components/SupplyOrders';
import CustomerCRUD from './components/CustomerCRUD';
import DeliveriesCRUD from './components/DeliveriesCRUD';
import ReviewsCRUD from './components/ReviewsCRUD';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'System Overview' },
    { id: 'flowers', label: 'Flowers Catalog' },
    { id: 'bouquet-flowers', label: 'Bouquet Builder' },
    { id: 'categories', label: 'Categories' },
    { id: 'inventory', label: 'Inventory Stock' },
    { id: 'orders', label: 'Client Orders' },
    { id: 'order-details', label: 'Order Details' },
    { id: 'payments', label: 'Payments Logs' },
    { id: 'customers', label: 'Customers List' },
    { id: 'deliveries', label: 'Deliveries Tracker' },
    { id: 'suppliers', label: 'Suppliers Directory' },
    { id: 'supply-orders', label: 'Supply Orders' },
    { id: 'occasions', label: 'Occasions Setup' },
    { id: 'reviews', label: 'Customer Reviews' },
  ];

  const renderOverview = () => (
    <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
      <div className="mb-4">
        <h2 style={{ fontFamily: 'Georgia, serif', color: '#110D1A', fontWeight: '600', fontSize: '26px' }}>System Overview</h2>
        <p style={{ color: '#666666', fontSize: '14px', margin: '4px 0 0 0' }}>Live store monitoring and data status.</p>
      </div>

      {/* STATS TILES */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E0D8', padding: '24px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#888888', fontWeight: '600' }}>Gross Volume</span>
            <h3 style={{ fontSize: '32px', color: '#110D1A', margin: '8px 0', fontWeight: '500' }}>EUR 14,840.00</h3>
            <span style={{ fontSize: '12px', color: '#0E5A5B', fontWeight: '500' }}>+12% vs last month</span>
          </div>
        </div>
        <div className="col-md-4">
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E0D8', padding: '24px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#888888', fontWeight: '600' }}>Active Orders</span>
            <h3 style={{ fontSize: '32px', color: '#110D1A', margin: '8px 0', fontWeight: '500' }}>42 Pending</h3>
            <span style={{ fontSize: '12px', color: '#A08040', fontWeight: '500' }}>8 scheduled for dispatch today</span>
          </div>
        </div>
        <div className="col-md-4">
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E6E0D8', padding: '24px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#888888', fontWeight: '600' }}>Registered Clients</span>
            <h3 style={{ fontSize: '32px', color: '#110D1A', margin: '8px 0', fontWeight: '500' }}>1,248 Users</h3>
            <span style={{ fontSize: '12px', color: '#0E5A5B', fontWeight: '500' }}>+24 new registrations this week</span>
          </div>
        </div>
      </div>

      {/* SYSTEM SYSTEM WARNING NOTIFICATION */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E6E0D8', borderLeft: '4px solid #0E5A5B', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h5 style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#110D1A', fontSize: '15px' }}>Inventory Alert</h5>
          <p style={{ fontSize: '13px', margin: 0, color: '#555555' }}>Three high-demand items are dropping below the safety stock threshold.</p>
        </div>
        <button onClick={() => setActiveTab('inventory')} style={{ background: '#110D1A', color: '#FFFFFF', border: 'none', padding: '8px 16px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer' }}>
          View Stock
        </button>
      </div>
    </div>
  );

  const renderActiveCRUD = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'flowers': return <FlowerCRUD />;
      case 'bouquet-flowers': return <BouquetFlowersCRUD />;
      case 'categories': return <CategoriesCRUD />;
      case 'inventory': return <InventoryCRUD />;
      case 'orders': return <OrderPage />;
      case 'order-details': return <OrderDetails />;
      case 'payments': return <PaymentsCrud />;
      case 'customers': return <CustomerCRUD />;
      case 'deliveries': return <DeliveriesCRUD />;
      case 'suppliers': return <SupplierCRUD />;
      case 'supply-orders': return <SupplyOrders />;
      case 'occasions': return <OccasionCRUD />;
      case 'reviews': return <ReviewsCRUD />;
      default: return renderOverview();
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAF8F5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#FFFFFF', borderRight: '1px solid #E6E0D8', padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        
        {/* LOGO AREA */}
        <div style={{ padding: '0 24px 20px 24px', borderBottom: '1px solid #E6E0D8', marginBottom: '16px' }}>
          <span style={{ fontSize: '10px', letterSpacing: '1.5px', color: '#888888', textTransform: 'uppercase', fontWeight: '700' }}>Internal Console</span>
          <h4 style={{ fontFamily: 'Georgia, serif', color: '#110D1A', margin: '4px 0 0 0', fontWeight: '600', fontSize: '18px' }}>Admin Dashboard</h4>
        </div>

        {/* NAVIGATION LINKS */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0 12px' }}>
          {menuItems.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '10px 16px', margin: '2px 0', border: 'none', borderRadius: '4px', 
                  fontSize: '13px',
                  fontWeight: isSelected ? '600' : '400',
                  backgroundColor: isSelected ? '#110D1A' : 'transparent',
                  color: isSelected ? '#FFFFFF' : '#333333',
                  cursor: 'pointer', transition: 'background-color 0.15s, color 0.15s'
                }}
                onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#FAF8F5'; }}
                onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* FOOTER ACTIONS */}
        <div style={{ padding: '16px 24px 0 24px', borderTop: '1px solid #E6E0D8' }}>
          <Link to="/" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', color: '#110D1A', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', padding: '10px', border: '1px solid #110D1A', transition: 'background-color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#110D1A'; e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#110D1A'; }}>
            Back to Client App
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT REGION */}
      <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {renderActiveCRUD()}
        </div>
      </div>

    </div>
  );
}

function AppContent() {
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname.startsWith('/admin/dashboard');

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#FAF8F5' }}>

      {!isAuthPage && !isDashboard && <Navbar />}

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <FlowerStore />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!isAuthPage && !isDashboard && (
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