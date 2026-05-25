import React from "react";
import { useCart } from "../context/CartContext.jsx"; // Sigurohu që path-i për te CartContext është i saktë bazuar në strukturën tënde
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                <img src={item.img} alt={item.title} style={{ width: "80px", height: "80px", objectFit: "cover", border: "1px solid #E6E0D8" }} />
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
              onClick={() => alert("Porosia u procesua me sukses! (Checkout Mock)")}
            >
              Vazhdo te Pagesa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;