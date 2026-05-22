import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [occasion, setOccasion] = useState("Birthday");

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
    alert(`Duke kërkuar dhurata për eventin: ${occasion} në kodin postar: ${zipCode}`);
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
        transition: "opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1)"
      }}
    >
      {/* 1. PROMO / TRUST STRIP */}
      <div
        style={{
          background: "#1F1F1F",
          color: "#FAF8F5",
          fontSize: "11px",
          letterSpacing: "2px",
          textAlign: "center",
          padding: "12px 0",
          textTransform: "uppercase",
          width: "100%"
        }}
      >
        🚚 Same-Day Delivery • 🌸 Freshness Guaranteed • ⭐ 4.8/5 Customer Satisfaction
      </div>

      {/* 2. QUICK SHOP BAR */}
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
              letterSpacing: "1px",
              color: "rgba(31,31,31,0.75)",
              cursor: "pointer",
              transition: "color 0.2s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#00676F")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(31,31,31,0.75)")}
          >
            {item}
          </div>
        ))}
      </div>

      {/* 3. WIDGETI KRYESOR: FIND THE PERFECT GIFT */}
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
        <div style={{ fontSize: "22px", fontWeight: "600", letterSpacing: "0.5px" }}>
          Find the Perfect Gift
        </div>
        <form onSubmit={handleSearchGift} style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Delivery ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #FFF",
              fontSize: "14px",
              width: "180px",
              outline: "none"
            }}
          />
          <select
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            style={{
              padding: "12px 16px",
              border: "1px solid #FFF",
              fontSize: "14px",
              background: "#FFF",
              color: "#1F1F1F",
              width: "180px",
              outline: "none",
              cursor: "pointer"
            }}
          >
            <option value="Birthday">Birthday</option>
            <option value="Anniversary">Anniversary</option>
            <option value="Sympathy">Sympathy</option>
            <option value="Just Because">Just Because</option>
          </select>
          <button
            type="submit"
            style={{
              background: "#E8F5F1",
              color: "#0E5A5B",
              border: "none",
              padding: "12px 32px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#FFFFFF"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#E8F5F1"}
          >
            Find a Gift Now
          </button>
        </form>
      </div>

      {/* 4. SUMMER HERO BANNER */}
      <section
        style={{
          display: "flex",
          background: "#FFF4D4", 
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap"
        }}
      >
        <div style={{ flex: "1 1 50%", minWidth: "300px" }}>
          <img
            src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=900"
            alt="Summer Flowers"
            style={{ width: "100%", height: "480px", objectFit: "cover", display: "block" }}
          />
        </div>
        <div style={{ flex: "1 1 50%", padding: "60px 4%", textAlign: "center", position: "relative" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "36px", color: "#1F1F1F", marginBottom: "12px" }}>
            Summer In Bloom Sale
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "72px", fontWeight: "700", color: "#1F1F1F", margin: "0 0 16px 0" }}>
            Save 20%
          </div>
          <p style={{ fontSize: "18px", color: "rgba(31,31,31,0.8)", marginBottom: "32px" }}>
            Send some sunshine their way.
          </p>
          
          {/* NDRYSHIMI KRYESOR: Ridrejtimi bëhet te Storefront e jo te CRUD-i i luleve */}
          <Link
            to="/"
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1F1F1F",
              textDecoration: "underline",
              textUnderlineOffset: "5px"
            }}
          >
            Shop Now
          </Link>
          
          <div style={{
            position: "absolute",
            top: "15%",
            right: "12%",
            background: "#FF8E8E",
            color: "#FFF",
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1px",
            transform: "rotate(-10deg)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <div>SITE</div>
            <div>WIDE!</div>
          </div>
        </div>
      </section>

      {/* 5. CIRCULAR KATEGORITË */}
      <section style={{ padding: "60px 6%", textAlign: "center", background: "#FFFFFF", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", gap: "40px", justifyContent: "center", overflowX: "auto", paddingBottom: "10px" }}>
          {circularCategories.map((cat) => (
            <div key={cat.name} style={{ flex: "0 0 130px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ width: "130px", height: "130px", borderRadius: "50%", overflow: "hidden", border: "1px solid #E6E0D8", marginBottom: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.02)" }}>
                <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: "14px", fontWeight: "500" }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. GRIDI I OFERTAVE */}
      <section style={{ padding: "60px 6%", background: "#FAF8F5", width: "100%", boxSizing: "border-box" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", textAlign: "center", marginBottom: "40px", fontWeight: "400" }}>
          This Season's Best Deals
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px", maxWidth: "1300px", margin: "0 auto" }}>
          {deals.map((deal, idx) => (
            <div key={idx} style={{ background: "#F5F0EB", border: "1px solid #E6E0D8", borderRadius: "4px", overflow: "hidden", textAlign: "center", cursor: "pointer" }}>
              <div style={{ padding: "24px 14px" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "1px", color: "rgba(31,31,31,0.6)", marginBottom: "6px" }}>
                  {deal.title}
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: "600", color: "#0E5A5B", marginBottom: "16px" }}>
                  {deal.label}
                </div>
              </div>
              <div style={{ height: "260px", overflow: "hidden" }}>
                <img src={deal.img} alt={deal.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }} 
                     onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04)"}
                     onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}/>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SEKSIONI I REVIEWS */}
      <section style={{ padding: "80px 6%", background: "#FFFFFF", borderTop: "1px solid #E6E0D8", width: "100%", boxSizing: "border-box" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", textAlign: "center", marginBottom: "50px", fontWeight: "400" }}>
          Some of the Great Things Our Customers Say About Us
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px", maxWidth: "1300px", margin: "0 auto" }}>
          {testimonials.map((t, idx) => (
            <div key={idx} style={{ textAlign: "center", padding: "0 15px" }}>
              <div style={{ color: "#2B1A4A", fontSize: "22px", marginBottom: "12px" }}>★★★★★</div>
              <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "10px" }}>{t.title}</div>
              <p style={{ fontSize: "14px", color: "rgba(31,31,31,0.8)", lineHeight: "1.6", fontStyle: "italic", minHeight: "80px" }}>
                {t.text}
              </p>
              <div style={{ fontSize: "13px", fontWeight: "600", marginTop: "16px", color: "#1F1F1F" }}>
                — {t.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING CHECKOUT CTA */}
      <div
        style={{
          position: "fixed",
          bottom: "22px",
          right: "22px",
          background: "#0E5A5B",
          color: "#FAF8F5",
          padding: "14px 26px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "600",
          letterSpacing: "1px",
          textTransform: "uppercase",
          cursor: "pointer",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          zIndex: 2000
        }}
      >
        Checkout →
      </div>
    </div>
  );
};

export default Homepage;