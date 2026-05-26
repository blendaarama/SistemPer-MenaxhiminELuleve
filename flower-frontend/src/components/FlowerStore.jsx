import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import axios from "axios"; // E shtuar

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  const { addToCart } = useCart();
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  // --- SHTETET PËR PRODUKTET DHE POP-UP ---
  const [deals, setDeals] = useState([]); // E ndryshuar nga konstante në state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  // --- SHTETET PËR REVIEW ---
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ customerId: "", comment: "" });

  useEffect(() => {
    setIsVisible(true);
    // Marrja e të dhënave nga backend-i yt
    axios.get("http://localhost:8080/api/products/all")
      .then(res => setDeals(res.data))
      .catch(err => console.error("Gabim në lidhje me backend:", err));
  }, []);

  const quickShop = ["Birthday", "Anniversary", "Romance", "Sympathy", "Same Day", "Best Sellers"];

  const circularCategories = [
    { name: "Birthday", img: "https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=300" },
    { name: "Sympathy", img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=300" },
    { name: "Occasions", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300" },
    { name: "Flowers", img: "https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=300" },
    { name: "Plants", img: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=300" },
    { name: "Gifts", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=300" }
  ];

  const testimonials = [
    { name: "Pamela", title: "Beautiful", text: "\"I bought these for my Nana's birthday she said they were amazingly beautiful!\"" },
    { name: "Michelle", title: "Best Flowers", text: "\"These flowers are beautiful and just as vibrant as the picture. One of the most beautiful bouquets!\"" },
    { name: "Betty", title: "Very Happy!", text: "\"I love how the recipient can plant the roses and enjoy them for a long time. Smells great!\"" },
    { name: "Brian", title: "Sweet Anniversary", text: "\"The strawberries arrived on time and were fantastic as always. The chocolate coating made it sweeter!\"" }
  ];

  const handleSearchGift = (e) => {
    e.preventDefault();
  };

  const openQuantityPopup = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowPopup(true);
  };

  const handleConfirmAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(selectedProduct);
    }
    setShowPopup(false);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#FAF8F5", color: "#1F1F1F", minHeight: "100vh", width: "100%", overflowX: "hidden", opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease-out", position: "relative" }}>
      
      {/* TOP BANNER STRIP */}
      <div style={{ background: "#110D1A", color: "#FAF8F5", fontSize: "11px", letterSpacing: "2px", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ flex: 1, textAlign: "center", textTransform: "uppercase" }}>
          Same-Day Delivery Available • Freshness Guaranteed • Premium Quality Standards
        </div>
        {isAdmin && (
          <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
            <button style={{ background: "#0E5A5B", color: "white", padding: "6px 14px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", borderRadius: "2px", transition: "background 0.2s" }}>
              Admin Dashboard
            </button>
          </Link>
        )}
      </div>

      {/* QUICK SHOP QUICK NAV */}
      <div style={{ 
  display: "flex", 
  gap: "60px",               /* Kjo rrit hapësirën midis linkeve */
  justifyContent: "center", 
  padding: "20px 0",         /* Pak më shumë padding lart e poshtë */
  borderBottom: "1px solid #E6E0D8", 
  background: "#FFFFFF" 
}}>
  <Link to="/user/flowers" style={{ 
    fontSize: "14px",        /* Font pak më i madh */
    fontWeight: "700",       /* Font më i trashë (bold) */
    color: "#1F1F1F", 
    textDecoration: "none",
    letterSpacing: "0.5px"   /* Pak hapësirë midis shkronjave */
  }}>
    Flowers
  </Link>
  <Link to="/user/bouquets" style={{ 
    fontSize: "14px", 
    fontWeight: "700", 
    color: "#1F1F1F", 
    textDecoration: "none",
    letterSpacing: "0.5px"
  }}>
    Bouquets
  </Link>
  <Link to="/user/occasions" style={{ 
    fontSize: "14px", 
    fontWeight: "700", 
    color: "#1F1F1F", 
    textDecoration: "none",
    letterSpacing: "0.5px"
  }}>
    Occasions
  </Link>
</div>

      {/* SEARCH UTILITY WIDGET */}
      <div style={{ background: "#0E5A5B", color: "#FFFFFF", padding: "24px 0", display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ fontSize: "20px", fontWeight: "500" }}>Find the Perfect Gift</div>
        <form onSubmit={handleSearchGift} style={{ display: "flex", gap: "12px" }}>
          <input type="text" placeholder="Delivery ZIP Code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} style={{ padding: "10px 16px", border: "1px solid #FFFFFF" }} />
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} style={{ padding: "10px 16px", background: "#FFFFFF" }}>
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
          </select>
          <button type="submit" style={{ background: "#110D1A", color: "#FFFFFF", border: "none", padding: "11px 28px" }}>Search</button>
        </form>
      </div>

      {/* HERO */}
      <section style={{ display: "flex", background: "#F5F0EB", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 50%" }}><img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=900" alt="Summer" style={{ width: "100%", height: "460px", objectFit: "cover" }} /></div>
        <div style={{ flex: "1 1 50%", padding: "60px 5%", textAlign: "center" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px" }}>Summer In Bloom Sale</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "64px", fontWeight: "700" }}>Save 20%</div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: "50px 6%", textAlign: "center", background: "#FFFFFF" }}>
        <div style={{ display: "flex", gap: "40px", justifyContent: "center", overflowX: "auto" }}>
          {circularCategories.map((cat) => (
            <div key={cat.name} style={{ flex: "0 0 130px" }}>
              <div style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 12px auto" }}><img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ fontSize: "13px", fontWeight: "600" }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section style={{ padding: "60px 6%", background: "#FAF8F5" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", textAlign: "center", marginBottom: "40px", fontWeight: "500", color: "#110D1A" }}>Seasonal Pricing Tiers</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", maxWidth: "1300px", margin: "0 auto" }}>
          {deals.map((deal) => (
            <div key={deal.id} style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", textAlign: "center" }}>
              <div style={{ padding: "20px 14px" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "1px", color: "#888888", marginBottom: "4px" }}>{deal.name}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "600", color: "#0E5A5B", marginBottom: "12px" }}>{deal.description}</div>
              </div>
              <div style={{ height: "240px", overflow: "hidden" }}><img src={deal.imageUrl} alt={deal.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: "10px", fontWeight: "600" }}>${deal.price}</div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openQuantityPopup(deal);
                  }}
                  style={{ background: "#2B1A4A", color: "white", border: "none", padding: "10px 18px", cursor: "pointer", width: "100%", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS / TESTIMONIALS */}
      <section style={{ padding: "60px 6%", background: "#FFFFFF", borderTop: "1px solid #E6E0D8", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", marginBottom: "40px", fontWeight: "500", color: "#110D1A" }}>
          Verified Client Feedback
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px", maxWidth: "1300px", margin: "0 auto" }}>
          {testimonials.map((t, idx) => (
            <div key={idx} style={{ textAlign: "center", padding: "0 10px" }}>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#110D1A", marginBottom: "10px" }}>
                {t.title}
              </div>
              <p style={{ fontSize: "14px", color: "#555555", fontStyle: "italic", lineHeight: "1.6", margin: "0 0 8px 0" }}>
                {t.text}
              </p>
            </div>
          ))}
        </div>
        <button onClick={() => setShowReviewModal(true)} style={{ marginTop: "30px", background: "#0E5A5B", color: "white", border: "none", padding: "10px 20px", cursor: "pointer" }}>
          Leave A Review
        </button>
      </section>

      {/* QUANTITY POPUP */}
      {showPopup && selectedProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(17, 13, 26, 0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#FFFFFF", padding: "30px", maxWidth: "400px", width: "90%", textAlign: "center", border: "1px solid #E6E0D8", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily: "Georgia, serif", color: "#2B1A4A", margin: "0 0 10px 0" }}>Zgjedh Sasinë</h3>
            <p style={{ fontSize: "14px", color: "#555555", marginBottom: "20px" }}>Sa paketa të <strong>{selectedProduct.name}</strong> dëshironi të shtoni?</p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px", marginBottom: "25px" }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: "#E6E0D8", border: "none", width: "35px", height: "35px", fontSize: "20px", cursor: "pointer", fontWeight: "bold" }}>-</button>
              <span style={{ fontSize: "18px", fontWeight: "600", width: "30px" }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ background: "#E6E0D8", border: "none", width: "35px", height: "35px", fontSize: "20px", cursor: "pointer", fontWeight: "bold" }}>+</button>
            </div>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#0E5A5B", marginBottom: "20px" }}>
              Preçi Total: ${(selectedProduct.price * quantity).toFixed(2)}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowPopup(false)} style={{ flex: 1, background: "transparent", border: "1px solid #777", padding: "10px", cursor: "pointer", fontSize: "12px", textTransform: "uppercase" }}>Anulo</button>
              <button onClick={handleConfirmAdd} style={{ flex: 1, background: "#2B1A4A", color: "white", border: "none", padding: "10px", cursor: "pointer", fontSize: "12px", textTransform: "uppercase", fontWeight: "600" }}>Shto në Shportë</button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#FFF", padding: "40px", width: "350px", borderRadius: "8px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily: "Georgia, serif", color: "#2B1A4A", fontSize: "22px", marginBottom: "20px" }}>Lini Vlerësimin</h3>
            <input placeholder="Emri" style={{ width: "100%", padding: "12px", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "4px" }} onChange={(e) => setNewReview({...newReview, customerId: e.target.value})} />
            <textarea placeholder="Komentoni këtu..." style={{ width: "100%", padding: "12px", height: "100px", marginBottom: "20px", border: "1px solid #ccc", borderRadius: "4px" }} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowReviewModal(false)} style={{ flex: 1, padding: "12px", background: "transparent", border: "1px solid #333", cursor: "pointer" }}>Anulo</button>
              <button 
                onClick={() => {
                  const existingReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
                  const newReviewEntry = { id: Date.now(), customerId: newReview.customerId || "Anonim", comment: newReview.comment, score: 5 };
                  localStorage.setItem("reviews", JSON.stringify([...existingReviews, newReviewEntry]));
                  setShowReviewModal(false);
                  alert("Faleminderit për vlerësimin!");
                }} 
                style={{ flex: 1, padding: "12px", background: "#0E5A5B", color: "#FFF", border: "none", cursor: "pointer" }}
              >
                Dërgo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;