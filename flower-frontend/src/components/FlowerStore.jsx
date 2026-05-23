import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [occasion, setOccasion] = useState("Birthday");
  
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  useEffect(() => {
    setIsVisible(true);
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

  const deals = [
    { title: "DEAL OF THE WEEK", label: "UP TO 40% OFF", img: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400" },
    { title: "OUR BEST VALUE", label: "May Bouquet of the Month", img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=400" },
    { title: "PLANT & GARDEN SALE", label: "UP TO 30% OFF", img: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=400" },
    { title: "THE BIG DISNEY SALE", label: "Up to 40% Off Disney", img: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400" }
  ];

  const testimonials = [
    { name: "Pamela", title: "Beautiful", text: "\"I bought these for my Nana's birthday she said they were amazingly beautiful!\"" },
    { name: "Michelle", title: "Best Flowers", text: "\"These flowers are beautiful and just as vibrant as the picture. One of the most beautiful bouquets!\"" },
    { name: "Betty", title: "Very Happy!", text: "\"I love how the recipient can plant the roses and enjoy them for a long time. Smells great!\"" },
    { name: "Brian", title: "Sweet Anniversary", text: "\"The strawberries arrived on time and were fantastic as always. Definitely made it sweeter!\"" }
  ];

  const handleSearchGift = (e) => {
    e.preventDefault();
    console.log(`Searching gifts for: ${occasion} in ZIP: ${zipCode}`);
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#FAF8F5",
        color: "#1F1F1F",
        minHeight: "100vh",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        boxSizing: "border-box",
        padding: 0,
        overflowX: "hidden",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.4s ease-out"
      }}
    >
      {/* 1. TOP BANNER STRIP */}
      <div
        style={{
          background: "#110D1A",
          color: "#FAF8F5",
          fontSize: "11px",
          letterSpacing: "2px",
          padding: "12px 0",
          textAlign: "center",
          textTransform: "uppercase",
          width: "100%"
        }}
      >
        Same-Day Delivery Available • Freshness Guaranteed • Premium Quality Standards
      </div>

      {/* ADMIN CONSOLE ROUTING BAR */}
      {isAdmin && (
        <div 
          style={{ 
            background: "#2B1A4A", 
            padding: "14px 6%", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <span style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: "500", letterSpacing: "0.5px" }}>
            Session Status: Authenticated Administrator Account
          </span>
          <Link 
            to="/admin/dashboard" 
            style={{ 
              background: "#FFFFFF", 
              color: "#2B1A4A", 
              textDecoration: "none", 
              padding: "8px 18px", 
              fontSize: "11px", 
              fontWeight: "600",
              letterSpacing: "1px",
              textTransform: "uppercase"
            }}
          >
            Open Admin Dashboard
          </Link>
        </div>
      )}

      {/* 2. NAVIGATION BAR SYSTEM */}
      <div
        style={{
          display: "flex",
          gap: "32px",
          justifyContent: "center",
          padding: "16px 0",
          borderBottom: "1px solid #E6E0D8",
          background: "#FFFFFF",
          width: "100%"
        }}
      >
        {quickShop.map((item) => (
          <div
            key={item}
            style={{
              fontSize: "13px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              color: "rgba(31,31,31,0.75)",
              cursor: "pointer",
              transition: "color 0.15s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#0E5A5B")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(31,31,31,0.75)")}
          >
            {item}
          </div>
        ))}
      </div>

      {/* 3. SEARCH UTILITY WIDGET */}
      <div
        style={{
          background: "#0E5A5B", 
          color: "#FFFFFF",
          padding: "24px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          width: "100%",
          flexWrap: "wrap"
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "500", letterSpacing: "0.5px" }}>
          Find the Perfect Gift
        </div>
        <form onSubmit={handleSearchGift} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Delivery ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            style={{ padding: "10px 16px", border: "1px solid #FFFFFF", fontSize: "14px", width: "180px", outline: "none" }}
          />
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            style={{ padding: "10px 16px", border: "1px solid #FFFFFF", fontSize: "14px", background: "#FFFFFF", color: "#1F1F1F", width: "180px", outline: "none", cursor: "pointer" }}
          >
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Sympathy">Sympathy</option>
            <option value="Just Because">Just Because</option>
          </select>
          <button
            type="submit"
            style={{ background: "#110D1A", color: "#FFFFFF", border: "none", padding: "11px 28px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#110D1A"}
          >
            Search Catalogue
          </button>
        </form>
      </div>

      {/* 4. MAIN HERO SELECTION */}
      <section style={{ display: "flex", background: "#F5F0EB", alignItems: "center", width: "100%", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 50%", minWidth: "300px" }}>
          <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=900" alt="Summer Collection" style={{ width: "100%", height: "460px", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ flex: "1 1 50%", padding: "60px 5%", textAlign: "center" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#110D1A", marginBottom: "8px" }}>Summer In Bloom Sale</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "64px", fontWeight: "700", color: "#110D1A", margin: "0 0 16px 0" }}>Save 20%</div>
          <p style={{ fontSize: "16px", color: "#555555", marginBottom: "28px" }}>Curated seasonal arrangements with premium floral selections.</p>
          <Link to="/" style={{ fontSize: "13px", fontWeight: "600", color: "#110D1A", textDecoration: "none", letterSpacing: "1px", textTransform: "uppercase", borderBottom: "2px solid #110D1A", paddingBottom: "4px" }}>
            Explore Collection
          </Link>
        </div>
      </section>

      {/* 5. DIRECTORY CATEGORIES */}
      <section style={{ padding: "50px 6%", textAlign: "center", background: "#FFFFFF", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: "40px", justifyContent: "center", overflowX: "auto", paddingBottom: "10px" }}>
          {circularCategories.map((cat) => (
            <div key={cat.name} style={{ flex: "0 0 130px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ width: "120px", height: "120px", borderRadius: "50%", overflow: "hidden", border: "1px solid #E6E0D8", marginBottom: "12px", margin: "0 auto 12px auto" }}>
                <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#110D1A" }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. GRID SYSTEMS: SEASON DEALS */}
      <section style={{ padding: "60px 6%", background: "#FAF8F5", width: "100%", boxSizing: "border-box" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", textAlign: "center", marginBottom: "40px", fontWeight: "500", color: "#110D1A" }}>Seasonal Pricing Tiers</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", maxWidth: "1300px", margin: "0 auto" }}>
          {deals.map((deal, idx) => (
            <div key={idx} style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", borderRadius: "0px", overflow: "hidden", textAlign: "center", cursor: "pointer" }}>
              <div style={{ padding: "20px 14px" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "1px", color: "#888888", marginBottom: "4px" }}>{deal.title}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: "600", color: "#0E5A5B", marginBottom: "12px" }}>{deal.label}</div>
              </div>
              <div style={{ height: "240px", overflow: "hidden" }}>
                <img src={deal.img} alt={deal.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.25s ease-out" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}/>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. REVIEWS & TESTIMONIALS DATA */}
      <section style={{ padding: "60px 6%", background: "#FFFFFF", borderTop: "1px solid #E6E0D8", width: "100%", boxSizing: "border-box" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "26px", textAlign: "center", marginBottom: "40px", fontWeight: "500", color: "#110D1A" }}>Verified Client Feedback</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px", maxWidth: "1300px", margin: "0 auto" }}>
          {testimonials.map((t, idx) => (
            <div key={idx} style={{ textAlign: "center", padding: "0 10px" }}>
              <div style={{ fontSize: "15px", fontWeight: "700", color: "#110D1A", marginBottom: "8px" }}>{t.title}</div>
              <p style={{ fontSize: "14px", color: "#555555", lineHeight: "1.6", fontStyle: "italic", minHeight: "70px", margin: 0 }}>{t.text}</p>
              <div style={{ fontSize: "12px", fontWeight: "600", marginTop: "14px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.5px" }}>— {t.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ACTION INTERACTION FIXED TRIGGER */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", background: "#110D1A", color: "#FAF8F5", padding: "12px 24px", borderRadius: "0px", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 2000 }}>
        Checkout Process
      </div>
    </div>
  );
};

export default Homepage;