import React, { useState } from 'react';
import FlowerStore from './components/FlowerStore';
import FlowerCRUD from './components/FlowerCRUD';
import BouquetCRUD from './components/BouquetCRUD';
import OccasionCRUD from './components/OccasionCRUD';

function App() {
  const [view, setView] = useState('client');

  return (
    <div className="min-vh-100 bg-light">
      {}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top">
        <div className="container">
          <span className="navbar-brand fw-bold" style={{letterSpacing: '2px', cursor: 'pointer'}} onClick={() => setView('client')}>
            ODE À LA ROSE
          </span>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <div className="d-flex gap-2 flex-wrap mt-3 mt-lg-0">
              <button 
                className={`btn btn-sm ${view === 'client' ? 'btn-light' : 'btn-outline-light'}`} 
                onClick={() => setView('client')}>
                👁️ Shiko Dyqanin
              </button>
              
              <div className="vr text-white mx-2 d-none d-md-block"></div>

              <button 
                className={`btn btn-sm ${view === 'flowers' ? 'btn-warning' : 'btn-outline-warning'}`} 
                onClick={() => setView('flowers')}>
                🌸 Lulet
              </button>
              <button 
                className={`btn btn-sm ${view === 'bouquets' ? 'btn-warning' : 'btn-outline-warning'}`} 
                onClick={() => setView('bouquets')}>
                💐 Buqetat
              </button>
              <button 
                className={`btn btn-sm ${view === 'occasions' ? 'btn-warning' : 'btn-outline-warning'}`} 
                onClick={() => setView('occasions')}>
                📅 Eventet
              </button>
            </div>
          </div>
        </div>
      </nav>

      {}
      <main className="py-4">
        {}
        {view === 'client' && <FlowerStore />}
        
        {}
        <div className="container">
          {view === 'flowers' && (
            <div className="animate__animated animate__fadeIn">
              <FlowerCRUD />
            </div>
          )}
          
          {view === 'bouquets' && (
            <div className="animate__animated animate__fadeIn">
              <BouquetCRUD />
            </div>
          )}

          {view === 'occasions' && (
            <div className="animate__animated animate__fadeIn">
              <OccasionCRUD />
            </div>
          )}
        </div>
      </main>

      {}
      <footer className="text-center py-4 mt-5 text-muted small border-top bg-white">
        &copy; 2026 <strong>ODE À LA ROSE</strong> - Paneli i Administrimit të Flower Shop
      </footer>
    </div>
  );
}

export default App;