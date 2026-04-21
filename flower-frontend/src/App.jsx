import React, { useState } from 'react';
import FlowerStore from './components/FlowerStore';
import FlowerCRUD from './components/FlowerCRUD';
import BouquetCRUD from './components/BouquetCRUD';
import OccasionCRUD from './components/OccasionCRUD';

function App() {
  // 'client' për dyqanin, 'flowers' për lule, 'bouquets' për buqetat, 'occasions' për eventet
  const [view, setView] = useState('client');

  return (
    <div className="min-vh-100 bg-light">
      {/* NAVBARI KRYESOR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
        <div className="container">
          <span className="navbar-brand fw-bold" style={{letterSpacing: '2px'}}>ODE À LA ROSE</span>
          
          <div className="d-flex gap-2 flex-wrap">
            <button 
              className={`btn btn-sm ${view === 'client' ? 'btn-light' : 'btn-outline-light'}`} 
              onClick={() => setView('client')}>
              👁️ Shiko Dyqanin
            </button>
            
            <div className="vr text-white mx-2 d-none d-md-block"></div>

            <button 
              className={`btn btn-sm ${view === 'flowers' ? 'btn-warning' : 'btn-outline-warning'}`} 
              onClick={() => setView('flowers')}>
              🌸 Menaxho Lulet
            </button>
            <button 
              className={`btn btn-sm ${view === 'bouquets' ? 'btn-warning' : 'btn-outline-warning'}`} 
              onClick={() => setView('bouquets')}>
              💐 Menaxho Buqetat
            </button>
            {/* BUTONI I RI PËR EVENTET */}
            <button 
              className={`btn btn-sm ${view === 'occasions' ? 'btn-warning' : 'btn-outline-warning'}`} 
              onClick={() => setView('occasions')}>
              📅 Eventet & Zbritjet
            </button>
          </div>
        </div>
      </nav>

      {/* PËRMBAJTJA DINAMIKE */}
      <main className="py-4">
        {view === 'client' && <FlowerStore />}
        
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

          {/* RENDERIMI I EVENTEVE */}
          {view === 'occasions' && (
            <div className="animate__animated animate__fadeIn">
              <OccasionCRUD />
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-4 mt-5 text-muted small border-top bg-white">
        &copy; 2026 <strong>ODE À LA ROSE</strong> - Paneli i Administrimit
      </footer>
    </div>
  );
}

export default App;