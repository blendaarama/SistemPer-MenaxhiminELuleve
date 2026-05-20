import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // SHTO KËTË
import FlowerStore from './components/FlowerStore';
import FlowerCRUD from './components/FlowerCRUD';
import BouquetCRUD from './components/BouquetCRUD';
import OccasionCRUD from './components/OccasionCRUD';
import SupplierCRUD from './components/SupplierCRUD';
import OrderPage from './components/OrderPage';

function App() {
  const [view, setView] = useState('client');

 return (
    <Router>
      <div className="min-vh-100 bg-light">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top">
           {/* Kodi i navbar-it tuaj këtu */}
        </nav>

        <main className="py-4">
          {view === 'client' && <FlowerStore setView={setView} />}
          <div className="container">
            {view === 'flowers' && <FlowerCRUD />}
            {view === 'bouquets' && <BouquetCRUD />}
            {view === 'occasions' && <OccasionCRUD />}
            {view === 'suppliers' && <SupplierCRUD />}
            {view === 'order' && <OrderPage />}
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