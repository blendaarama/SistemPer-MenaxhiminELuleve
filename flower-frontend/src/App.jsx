import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from "react-router-dom";

// PUBLIC
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import FlowerStore from "./components/FlowerStore";
import OrderCRUD from "./components/OrderCRUD"; // Qendra menaxhuese e Adminit

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
import DeliveriesCRUD from "./components/DeliveriesCRUD.jsx";
import ReviewsCRUD from "./components/ReviewsCRUD";

import PrivateRoute from "./components/PrivateRoute";
import { useCart } from "./context/CartContext.jsx"; 

// === KOMPONENTI I SHPORTËS ME FORMEN E PAGESËS ===
const CartPageComponent = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    city: "Prishtinë",
    address: "",
    phone: "",
    paymentMethod: "Cash"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({ ...shippingDetails, [name]: value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.phone) {
      alert("Ju lutem plotësoni të gjitha fushat e detyrueshme!");
      return;
    }
    
    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000), 
      customer: shippingDetails.fullName, 
      date: new Date().toLocaleDateString("sq-AL"), 
      deliveryAddress: `${shippingDetails.address}, ${shippingDetails.city}`, 
      totalRevenue: total.toFixed(2), 
      status: "PENDING" 
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    existingOrders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(existingOrders));

    setOrderSuccess(true);
    setTimeout(() => {
      clearCart(); 
      setShowCheckoutModal(false);
      setOrderSuccess(false);
    }, 3500); 
  };

  return (
    <div style={{ padding: "40px 6%", maxWidth: "900px", margin: "40px auto", backgroundColor: "#FFFFFF", border: "1px solid #E6E0D8", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ fontFamily: "Georgia, serif", color: "#2B1A4A", marginBottom: "30px" }}>Shporta Juaj e Blerjeve</h2>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <p style={{ color: "#777", fontSize: "16px" }}>Shporta juaj është momentalisht boshe.</p>
          <Link to="/" style={{ display: "inline-block", marginTop: "15px", background: "#2B1A4A", color: "white", padding: "10px 20px", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>
            Kthehu te Dyqani
          </Link>
        </div>
      ) : (
        <div>
          <div style={{ borderBottom: "2px solid #2B1A4A", paddingBottom: "10px", marginBottom: "20px", fontWeight: "600", display: "flex", justifyContent: "space-between" }}>
            <span>Produkti</span>
            <span>Preçi & Sasia</span>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", borderBottom: "1px solid #E6E0D8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <img src={item.img} alt={item.title || item.label} style={{ width: "80px", height: "80px", objectFit: "cover", border: "1px solid #E6E0D8" }} />
                <div>
                  <h4 style={{ margin: "0 0 5px 0", color: "#110D1A", fontSize: "16px" }}>{item.title || item.label}</h4>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: "transparent", color: "#ff4d4d", border: "none", padding: 0, cursor: "pointer", fontSize: "13px", textDecoration: "underline" }}
                  >
                    Hiq nga shporta
                  </button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontWeight: "600", color: "#0E5A5B", fontSize: "16px" }}>${item.price}</span>
                <div style={{ color: "#777", fontSize: "13px", marginTop: "4px" }}>Sasia: {item.quantity}</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: "30px", textAlign: "right" }}>
            <h3 style={{ fontFamily: "Georgia, serif", color: "#2B1A4A", marginBottom: "20px" }}>Totali: ${total.toFixed(2)}</h3>
            <button 
              onClick={clearCart} 
              style={{ background: "transparent", color: "#777", border: "1px solid #777", padding: "10px 20px", marginRight: "15px", cursor: "pointer", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}
            >
              Pastro Shportën
            </button>
            <button 
              style={{ background: "#2B1A4A", color: "white", border: "none", padding: "12px 30px", cursor: "pointer", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}
              onClick={() => setShowCheckoutModal(true)}
            >
              Vazhdo te Pagesa
            </button>
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(17, 13, 26, 0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 99999, backdropFilter: "blur(5px)" }}>
          <div style={{ background: "#FFFFFF", padding: "35px", maxWidth: "500px", width: "90%", border: "1px solid #E6E0D8", boxShadow: "0 15px 35px rgba(0,0,0,0.3)", position: "relative" }}>
            
            {!orderSuccess ? (
              <>
                <h3 style={{ fontFamily: "Georgia, serif", color: "#2B1A4A", marginBottom: "5px", textAlign: "center" }}>Të Dhënat e Dërgesës</h3>
                <p style={{ fontSize: "13px", color: "#666", textAlign: "center", marginBottom: "25px" }}>Plotësoni formën për të finalizuar faturën tuaj.</p>
                
                <form onSubmit={handlePlaceOrder} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "#110D1A" }}>Emri & Mbiemri *</label>
                    <input type="text" name="fullName" required value={shippingDetails.fullName} onChange={handleInputChange} style={{ width: "100%", padding: "10px", border: "1px solid #CBD5E1", fontSize: "14px" }} placeholder="Filan Fisteku" />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "#110D1A" }}>Qyteti *</label>
                      <select name="city" value={shippingDetails.city} onChange={handleInputChange} style={{ width: "100%", padding: "10px", border: "1px solid #CBD5E1", fontSize: "14px", background: "white" }}>
                        <option value="Prishtinë">Prishtinë</option>
                        <option value="Ferizaj">Ferizaj</option>
                        <option value="Prizren">Prizren</option>
                        <option value="Gjilan">Gjilan</option>
                        <option value="Pejë">Pejë</option>
                        <option value="Mitrovicë">Mitrovicë</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "#110D1A" }}>Numri i Telefonit *</label>
                      <input type="tel" name="phone" required value={shippingDetails.phone} onChange={handleInputChange} style={{ width: "100%", padding: "10px", border: "1px solid #CBD5E1", fontSize: "14px" }} placeholder="+383 4X XXX XXX" />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "#110D1A" }}>Adresa e Plotë *</label>
                    <input type="text" name="address" required value={shippingDetails.address} onChange={handleInputChange} style={{ width: "100%", padding: "10px", border: "1px solid #CBD5E1", fontSize: "14px" }} placeholder="Rruga, Numri i hyrjes/shtëpisë" />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "5px", color: "#110D1A" }}>Mënyra e Pagesës</label>
                    <select name="paymentMethod" value={shippingDetails.paymentMethod} onChange={handleInputChange} style={{ width: "100%", padding: "10px", border: "1px solid #CBD5E1", fontSize: "14px", background: "white" }}>
                      <option value="Cash">Pagesë në dorëzim (Cash on Delivery)</option>
                      <option value="Card">Me Kartelë Bankare (Mock Card)</option>
                    </select>
                  </div>

                  <div style={{ background: "#F8FAFC", padding: "12px", border: "1px dashed #CBD5E1", marginTop: "10px", fontSize: "14px", fontWeight: "600", color: "#0E5A5B", display: "flex", justifyContent: "space-between" }}>
                    <span>Totali për Pagesë:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button type="button" onClick={() => setShowCheckoutModal(false)} style={{ flex: 1, background: "transparent", border: "1px solid #777", padding: "12px", cursor: "pointer", fontSize: "12px", textTransform: "uppercase" }}>Anulo</button>
                    <button type="submit" style={{ flex: 1, background: "#2B1A4A", color: "white", border: "none", padding: "12px", cursor: "pointer", fontSize: "12px", textTransform: "uppercase", fontWeight: "600", letterSpacing: "1px" }}>Përfundo Porosinë</button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ padding: "30px 10px", textAlign: "center" }}>
                <div style={{ fontSize: "50px", color: "#0E5A5B", marginBottom: "20px" }}>🎉</div>
                <h3 style={{ fontFamily: "Georgia, serif", color: "#2B1A4A", marginBottom: "10px" }}>Porosia u Krye me Sukses!</h3>
                <p style={{ fontSize: "14px", color: "#555", lineHeight: "1.5" }}>
                  Faleminderit <strong>{shippingDetails.fullName}</strong>! Lulet tuaja do të dërgohen në <strong>{shippingDetails.address}, {shippingDetails.city}</strong> brenda kohës rekord.
                </p>
                <div style={{ marginTop: "20px", fontSize: "12px", color: "#888", fontStyle: "italic" }}>
                  Po ju kthejmë te dyqani...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function AppContent() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#FAF8F5" }}>

      {!isAuthPage && <Navbar />}

      <main>
        <Routes>
          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* HOME */}
          <Route path="/" element={<PrivateRoute><FlowerStore /></PrivateRoute>} />

          {/* ADMIN DASHBOARD */}
          <Route path="/admin/dashboard" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />

          {/* PUBLIC CLIENT SIDE ROUTES */}
          <Route path="/order" element={<PrivateRoute><CartPageComponent /></PrivateRoute>} />

          {/* ADMIN MANAGEMENT (CRUD) ROUTES */}
          <Route path="/flowers" element={<PrivateRoute adminOnly={true}><FlowerCRUD /></PrivateRoute>} />
          <Route path="/bouquet-flowers" element={<PrivateRoute adminOnly={true}><BouquetFlowersCRUD /></PrivateRoute>} />
          <Route path="/occasions" element={<PrivateRoute adminOnly={true}><OccasionCRUD /></PrivateRoute>} />
          <Route path="/suppliers" element={<PrivateRoute adminOnly={true}><SupplierCRUD /></PrivateRoute>} />
          
          {/* RREGULLUAR KËTU: Kjo hap regjistrin menaxhues të porosive për adminin pa u përplasur me shportën */}
          <Route path="/admin/orders" element={<PrivateRoute adminOnly={true}><OrderPage /></PrivateRoute>} />
          <Route path="/order-details" element={<PrivateRoute adminOnly={true}><OrderDetails /></PrivateRoute>} />
          <Route path="/payments" element={<PrivateRoute adminOnly={true}><PaymentsCrud /></PrivateRoute>} />
          <Route path="/supply-orders" element={<PrivateRoute adminOnly={true}><SupplyOrders /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute adminOnly={true}><CustomerCRUD /></PrivateRoute>} />
          <Route path="/deliveries" element={<PrivateRoute adminOnly={true}><DeliveriesCRUD /></PrivateRoute>} />
          <Route path="/reviews" element={<PrivateRoute adminOnly={true}><ReviewsCRUD /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute adminOnly={true}><CategoriesCRUD /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute adminOnly={true}><InventoryCRUD /></PrivateRoute>} />
          
          {/* Rruga kryesore e integrimit të panelit kontrollues */}
          <Route path="/admin/orders-registry" element={<PrivateRoute adminOnly={true}><OrderCRUD /></PrivateRoute>} />

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