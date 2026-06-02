import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import axios from "axios";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";

const C = {
  dark:   "#0F0A1E",
  teal:   "#0D5C5C",
  tealLt: "#0A4A4A",
  cream:  "#FAF8F5",
  white:  "#FFFFFF",
  offWht: "#F5F1EC",
  border: "#E8E2D9",
  text:   "#1A1A2E",
  muted:  "#6B7280",
  gold:   "#D4A853",
  red:    "#C0392B",
};

const FONT  = "'DM Sans', system-ui, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

/* ─── SKELETON CARD ─────────────────────────────────── */
const SkeletonCard = () => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
    <div style={{ height: "240px", background: `linear-gradient(90deg, #f0ede8 25%, #e8e3dd 50%, #f0ede8 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
    <div style={{ padding: "20px" }}>
      {[70, 50, 35].map((w, i) => (
        <div key={i} style={{ height: "13px", width: `${w}%`, background: `linear-gradient(90deg, #f0ede8 25%, #e8e3dd 50%, #f0ede8 75%)`, backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", borderRadius: "4px", marginBottom: "10px" }} />
      ))}
    </div>
  </div>
);

/* ─── STAR RATING ────────────────────────────────────── */
/*
 * Self-contained component.
 * - score  : current rating value (0-5)
 * - onRate : callback(newScore) — if omitted the stars are read-only
 */
const StarRating = ({ score = 0, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const interactive = typeof onRate === "function";

  return (
    <div style={{ color: C.gold, fontSize: "22px", cursor: interactive ? "pointer" : "default", userSelect: "none", marginBottom: "4px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          onClick={() => interactive && onRate(i)}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          style={{ marginRight: "2px", transition: "color 0.15s", color: i <= (hoverRating || score) ? C.gold : "#D9D0C4" }}
        >
          {i <= (hoverRating || score) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   HOMEPAGE
═══════════════════════════════════════════════════════ */
const Homepage = () => {
  const [isVisible,       setIsVisible]       = useState(false);
  const [zipCode,         setZipCode]         = useState("");
  const [occasion,        setOccasion]        = useState("Birthday");
  const [email,           setEmail]           = useState("");
  const [emailSent,       setEmailSent]       = useState(false);
  const [hoveredCard,     setHoveredCard]     = useState(null);
  const [isSticky,        setIsSticky]        = useState(false);
  const [showBackToTop,   setShowBackToTop]   = useState(false);
  const [deals,           setDeals]           = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity,        setQuantity]        = useState(1);
  const [showPopup,       setShowPopup]       = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews,         setReviews]         = useState(() => {
    try { return JSON.parse(localStorage.getItem("reviews") || "[]"); }
    catch { return []; }
  });
  const [newReview,  setNewReview]  = useState({ customerId: "", comment: "" });
  const [reviewRating, setReviewRating] = useState(5);
  const [isAdmin]                   = useState(() => localStorage.getItem("role") === "ADMIN");

  /* search state — used by the hero search bar */
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { addToCart } = useCart();

  /* scroll */
  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 72);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* fetch products */
  useEffect(() => {
    setIsVisible(true);
    axios.get("http://localhost:8080/api/products/all")
      .then(res => setDeals(res.data))
      .catch(() => setError("Failed to load products. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const filteredDeals = useMemo(() =>
    deals.filter(p => !occasion || p.occasion?.toLowerCase() === occasion.toLowerCase()),
    [deals, occasion]
  );

  /* handlers */
  const openQuantityPopup = p => { setSelectedProduct(p); setQuantity(1); setShowPopup(true); };
  const handleConfirmAdd  = () => { addToCart(selectedProduct, quantity); setShowPopup(false); };
  const scrollToTop       = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* unified search handler */
  const handleSearch = e => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?query=${encodeURIComponent(q)}`);
  };

  const handleNewsletterSubmit = e => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailSent(true);
    setEmail("");
  };

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) return;
    const entry = {
      id: Date.now(),
      customerId: newReview.customerId.trim() || "Anonymous",
      comment: newReview.comment,
      score: reviewRating,
    };
    const updated = [...reviews, entry];
    localStorage.setItem("reviews", JSON.stringify(updated));
    setReviews(updated);
    setNewReview({ customerId: "", comment: "" });
    setReviewRating(5);
    setShowReviewModal(false);
  };

  /* data */
  const categories = [
    { name: "Birthday",  img: "/images/birthday.jpeg" },
    { name: "Sympathy",  img: "/images/images.jpeg" },
    { name: "Occasions", img: "/images/occassion.jpeg" },
    { name: "Flowers",   img: "/images/imagess.jpeg" },
  ];

  const testimonials = [
    { name: "Pamela R.",   title: "Absolutely stunning arrangement", text: "Ordered for my Nana's 80th birthday — the bouquet arrived perfectly fresh and she was in tears. Will absolutely order again.", score: 5 },
    { name: "Michelle T.", title: "Exactly as pictured",             text: "I've had bad experiences with other florists sending wilted flowers. These were vibrant, fragrant, and lasted over two weeks.", score: 5 },
    { name: "Betty K.",    title: "A gift that keeps giving",        text: "Loved that the roses came with planting instructions. My mom planted them in her garden — she messages me photos every week.", score: 5 },
    { name: "Brian M.",    title: "Delivered on time, perfect condition", text: "Ordered chocolate-covered strawberries for our anniversary. Same-day delivery was flawless and packaging was really premium.", score: 5 },
  ];

  const allTestimonials = [
    ...testimonials,
    ...reviews.map(r => ({ name: r.customerId, title: "Verified Purchase", text: r.comment, score: r.score })),
  ];

  const trustBadges = [
    { icon: "🚚", label: "Free delivery",       sub: "On orders over $60" },
    { icon: "🌿", label: "Farm-fresh flowers",  sub: "Sourced within 48 hrs" },
    { icon: "↩️", label: "Freshness guarantee", sub: "7-day happiness promise" },
    { icon: "🔒", label: "Secure checkout",     sub: "256-bit SSL encrypted" },
  ];

  /* shared input style */
  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: `1px solid ${C.border}`,
    borderRadius: "8px",
    fontFamily: FONT,
    fontSize: "14px",
    color: C.text,
    background: C.white,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════ */
  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_URL} rel="stylesheet" />

      {/* Global CSS */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn   { from { opacity: 0; transform: scale(0.92) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        body { font-family: ${FONT}; }
        .hl:hover { color: ${C.teal} !important; opacity: 1 !important; }
        .nav-link  { position: relative; }
        .nav-link::after { content: ""; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: ${C.teal}; transition: width 0.25s ease; }
        .nav-link:hover::after { width: 100%; }
        .product-card { transition: transform 0.28s ease, box-shadow 0.28s ease; }
        .product-card:hover { transform: translateY(-7px); box-shadow: 0 24px 56px rgba(0,0,0,0.12) !important; }
        .cat-item { transition: transform 0.25s ease; cursor: pointer; }
        .cat-item:hover { transform: scale(1.06); }
        .cat-item:hover .cat-label { color: ${C.teal}; }
        .btn-teal:hover   { background: ${C.tealLt} !important; }
        .btn-dark:hover   { background: #1a0f33 !important; }
        .btn-outline:hover { background: #f5f1ec !important; }
        .trust-badge { transition: box-shadow 0.25s, transform 0.25s; }
        .trust-badge:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
        .back-to-top { transition: background 0.25s, transform 0.2s !important; }
        .back-to-top:hover { background: ${C.tealLt} !important; transform: scale(1.1) !important; }
        input::placeholder, textarea::placeholder { color: #AAA; }
        input:focus, textarea:focus, select:focus { border-color: ${C.teal} !important; box-shadow: 0 0 0 3px rgba(13,92,92,0.12); }
        .search-dark:focus { border-color: rgba(255,255,255,0.6) !important; box-shadow: 0 0 0 3px rgba(255,255,255,0.12) !important; }
      `}</style>

      <div style={{ fontFamily: FONT, background: C.cream, color: C.text, minHeight: "100vh", width: "100%", overflowX: "hidden", opacity: isVisible ? 1 : 0, transition: "opacity 0.55s ease" }}>

        {/* ── ANNOUNCEMENT BAR ────────────────────────────── */}
        <div style={{ background: C.teal, color: "#fff", fontSize: "12px", fontWeight: "500", letterSpacing: "0.5px", padding: "9px 24px", textAlign: "center" }}>
          🌸 Free shipping on orders over $60 &nbsp;·&nbsp; Same-day delivery available in select cities &nbsp;·&nbsp;
          <span style={{ textDecoration: "underline", cursor: "pointer" }}>See delivery areas →</span>
        </div>

        {/* ── STICKY NAV ──────────────────────────────────── */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px", height: "64px",
          background: isSticky ? "rgba(255,255,255,0.97)" : C.white,
          backdropFilter: isSticky ? "blur(12px)" : "none",
          borderBottom: `1px solid ${C.border}`,
          position: isSticky ? "fixed" : "relative",
          top: 0, left: 0, right: 0, zIndex: 1000,
          boxShadow: isSticky ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
          transition: "box-shadow 0.3s, background 0.3s",
        }}>
          {/* Logo */}
          <div style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: "700", color: C.dark, letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
             You're eternal.
          </div>

          {/* Nav links */}
          <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
            {[
              { label: "Flowers",   to: "/user/flowers" },
              { label: "Bouquets",  to: "/user/bouquets" },
              { label: "Occasions", to: "/user/occasions" },
            ].map(item => (
              <Link key={item.label} to={item.to} className="nav-link"
                style={{ fontFamily: FONT, fontSize: "13px", fontWeight: "500", color: C.text, textDecoration: "none", letterSpacing: "0.2px", paddingBottom: "4px" }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
            {isAdmin && (
              <Link to="/admin/dashboard" style={{ textDecoration: "none" }}>
                <button className="btn-teal" style={{ background: C.teal, color: "#fff", padding: "8px 16px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "600", borderRadius: "6px", fontFamily: FONT, transition: "background 0.2s" }}>
                  Admin
                </button>
              </Link>
            )}
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button style={{ background: "transparent", border: `1px solid ${C.border}`, padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "500", cursor: "pointer", color: C.text, fontFamily: FONT, transition: "border-color 0.2s" }}>
                Sign In
              </button>
            </Link>
            <Link to="/order" style={{ textDecoration: "none" }}>
            </Link>
          </div>
        </nav>
        {isSticky && <div style={{ height: "64px" }} />}

        {/* ── HERO ────────────────────────────────────────── */}
        <section style={{ display: "flex", background: C.offWht, alignItems: "stretch", minHeight: "540px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 520px", position: "relative", overflow: "hidden" }}>
            <img
              src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1200"
              alt="Summer bloom bouquet"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "420px" }}
              loading="lazy"
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,10,30,0.18) 0%, transparent 60%)" }} />
          </div>

          <div style={{ flex: "1 1 420px", padding: "64px 6%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ display: "inline-block", background: C.teal, color: "#fff", fontSize: "11px", fontWeight: "600", letterSpacing: "1.5px", textTransform: "uppercase", padding: "5px 14px", borderRadius: "20px", marginBottom: "20px", width: "fit-content", fontFamily: FONT }}>
              Summer Sale — Up to 20% off
            </span>

            <h1 style={{ fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: "700", color: C.dark, lineHeight: "1.15", marginBottom: "18px" }}>
              Fresh flowers<br />delivered to<br />your door
            </h1>

            <p style={{ fontFamily: FONT, fontSize: "15px", color: C.muted, lineHeight: "1.75", marginBottom: "24px", maxWidth: "380px" }}>
              Hand-arranged by local florists, sourced from sustainable farms.
              Same-day delivery available Monday through Saturday.
            </p>

            {/* ── HERO SEARCH BAR ── */}
            <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: "400px", marginBottom: "24px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <input
                type="text"
                placeholder="Search flowers, bouquets…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: "13px 16px", border: "none", fontSize: "14px", fontFamily: FONT, outline: "none", color: C.text, background: C.white }}
              />
              <button
                type="submit"
                style={{ background: C.teal, color: "#fff", border: "none", padding: "13px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.tealLt}
                onMouseLeave={e => e.currentTarget.style.background = C.teal}
              >
                Search
              </button>
            </form>
<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
  {/* Shop the Sale */}
  <button
    className="btn-teal"
    onClick={() => navigate("/user/occasions")}
    style={{
      background: C.teal,
      color: "#fff",
      border: "none",
      padding: "14px 28px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      fontFamily: FONT,
      transition: "background 0.2s",
    }}
  >
    Shop the Sale
  </button>

  {/* View All Collections */}
  <button
    className="btn-outline"
    onClick={() => navigate("/user/flowers")}
    style={{
      background: "transparent",
      color: C.text,
      border: `1px solid ${C.border}`,
      padding: "14px 28px",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      fontFamily: FONT,
      transition: "background 0.2s",
    }}
  >
    View All Collections
  </button>
</div>   {/* ← KJO KA MUNGU */}


</div>
</section>
        {/* ── TRUST BADGES ────────────────────────────────── */}
        <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "0 6%" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", borderLeft: `1px solid ${C.border}` }}>
            {trustBadges.map((b, i) => (
              <div key={i} className="trust-badge" style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: "14px", borderRight: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: "24px" }}>{b.icon}</span>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: "13px", fontWeight: "600", color: C.text, marginBottom: "2px" }}>{b.label}</div>
                  <div style={{ fontFamily: FONT, fontSize: "12px", color: C.muted }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SEARCH / FILTER BAR ─────────────────────────── */}
        <section style={{ background: C.dark, padding: "28px 6%" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
            <span style={{ fontFamily: SERIF, fontSize: "18px", color: "#fff", fontWeight: "600", whiteSpace: "nowrap" }}>Find a gift for:</span>
            <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", flex: 1, flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="text"
                placeholder="Search products…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-dark"
                style={{ flex: "1 1 180px", maxWidth: "240px", padding: "12px 14px", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px", fontFamily: FONT, fontSize: "14px", color: "#fff", background: "rgba(255,255,255,0.1)", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }}
              />
              <select
                value={occasion}
                onChange={e => setOccasion(e.target.value)}
                style={{ flex: "1 1 160px", maxWidth: "200px", ...inputStyle }}
              >
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Romance">Romance</option>
                <option value="Sympathy">Sympathy</option>
              </select>
              <button type="submit" className="btn-teal" style={{ background: C.teal, color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", fontFamily: FONT, fontSize: "13px", fontWeight: "600", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}>
                Search gifts
              </button>
            </form>
          </div>
        </section>

        {/* ── CATEGORIES ──────────────────────────────────── */}
        <section style={{ padding: "64px 6%", background: C.white }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
           <div style={{ display: "flex", gap: "28px", overflowX: "auto", paddingBottom: "8px" }}>
  {categories.map(cat => (
    /* Këtu e mbështjellim me Link */
    <Link 
      key={cat.name} 
      to={`/user/${cat.name.toLowerCase()}`} 
      style={{ textDecoration: "none" }}
    >
      <div className="cat-item" style={{ flex: "0 0 120px", textAlign: "center" }}>
        <div style={{ width: "110px", height: "110px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 12px", border: `3px solid ${C.border}` }}>
          <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div className="cat-label" style={{ fontFamily: FONT, fontSize: "13px", fontWeight: "600", color: C.text }}>
          {cat.name}
        </div>
      </div>
    </Link>
  ))}
</div>
          </div>
        </section>

        
        {/* ── PRODUCTS ────────────────────────────────────── */}
<section style={{ padding: "64px 6%", background: C.cream }}>
  <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

    {/* HEADER */}
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        marginBottom: "10px",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <h2 style={{ fontFamily: SERIF, fontSize: "28px", fontWeight: "700", color: C.dark }}>
        Seasonal collection
      </h2>

      <span style={{ fontFamily: FONT, fontSize: "13px", color: C.muted }}>
        Hand-picked fresh items for you 🌿
      </span>
    </div>

    <p style={{ fontFamily: FONT, fontSize: "14px", color: C.muted, marginBottom: "40px" }}>
      Discover fresh flowers, signature bouquets, and create your own arrangement.
    </p>

    {/* ── 3 FLOWERS ── */}
    <h3 style={{ fontFamily: SERIF, marginBottom: "16px" }}>
      Fresh Flowers
    </h3>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "40px",
      }}
    >
      {deals.slice(0, 3).map((item) => (
        <div
          key={item.id}
          style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <img
            src={item.foto || item.imageUrl}
            alt={item.emertimi || item.name}
            style={{
              width: "100%",
              height: "140px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
            loading="lazy"
          />

          <h4 style={{ fontFamily: SERIF, fontSize: "16px" }}>
            {item.emertimi || item.name}
          </h4>

          <p style={{ fontFamily: FONT, fontSize: "13px", color: C.muted }}>
            ${item.cmimi ?? item.price}
          </p>
        </div>
      ))}
    </div>

    {/* ── 2 BOUQUETS ── */}
    <h3 style={{ fontFamily: SERIF, marginBottom: "16px" }}>
      Popular Bouquets
    </h3>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "20px",
        marginBottom: "40px",
      }}
    >
      {deals.slice(0, 2).map((item) => (
        <div
          key={item.id}
          style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          <img
            src={item.foto || item.imageUrl}
            alt={item.emertimi || item.name}
            style={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
            loading="lazy"
          />

          <h4 style={{ fontFamily: SERIF, fontSize: "16px" }}>
            {item.emertimi || item.name}
          </h4>

          <p style={{ fontFamily: FONT, fontSize: "13px", color: C.muted }}>
            ${item.cmimi ?? item.price}
          </p>
        </div>
      ))}
    </div>

    {/* ── CREATE BUTTON ── */}
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3 style={{ fontFamily: SERIF, marginBottom: "10px" }}>
        Want something unique?
      </h3>

      <button
        onClick={() => navigate("/user/bouquet-crud")}
        style={{
          background: C.teal,
          color: "#fff",
          border: "none",
          padding: "14px 26px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          fontFamily: FONT,
          transition: "0.2s",
        }}
      >
        🌸 Create your own bouquet
      </button>
    </div>

  </div>
</section>

        {/* ── NEWSLETTER ──────────────────────────────────── */}
        <section style={{ background: C.dark, padding: "80px 6%" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", padding: "5px 14px", borderRadius: "20px", marginBottom: "20px", fontFamily: FONT }}>
              Newsletter
            </span>
            <h2 style={{ fontFamily: SERIF, fontSize: "36px", fontWeight: "700", color: "#fff", marginBottom: "14px", lineHeight: "1.2" }}>
              Subscribe and save 10%
            </h2>
            <p style={{ fontFamily: FONT, fontSize: "15px", color: "rgba(255,255,255,0.6)", lineHeight: "1.8", marginBottom: "36px" }}>
              Get early access to seasonal collections, exclusive subscriber discounts,
              and care tips from our expert florists — delivered once a week.
            </p>

            {emailSent ? (
              <div style={{ background: "rgba(13,92,92,0.35)", border: "1px solid rgba(13,92,92,0.5)", borderRadius: "10px", padding: "20px 28px", color: "#fff", fontFamily: FONT, fontSize: "14px", lineHeight: "1.6" }}>
                🌸 <strong>Welcome to the Eternal Rose. family!</strong><br />
                <span style={{ opacity: 0.8 }}>Your 10% discount code will arrive shortly.</span>
              </div>
            ) : (
              <div>
                <form onSubmit={handleNewsletterSubmit} style={{ display: "flex", maxWidth: "460px", margin: "0 auto 12px", borderRadius: "10px", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ flex: 1, padding: "15px 18px", border: "none", fontSize: "14px", fontFamily: FONT, outline: "none", color: C.text }}
                  />
                  <button type="submit" className="btn-teal" style={{ background: C.teal, color: "#fff", border: "none", padding: "15px 22px", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap", transition: "background 0.2s" }}>
                    Get 10% off
                  </button>
                </form>
                <p style={{ fontFamily: FONT, fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "10px" }}>
                  By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────── */}
        <section style={{ padding: "80px 6%", background: C.white }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", color: C.teal, marginBottom: "10px" }}>
                Customer reviews
              </p>
              <h2 style={{ fontFamily: SERIF, fontSize: "32px", fontWeight: "700", color: C.dark, marginBottom: "10px" }}>
                Loved by thousands of customers
              </h2>
              <p style={{ fontFamily: FONT, fontSize: "14px", color: C.muted }}>
                Over 12,000 five-star reviews and counting.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              {allTestimonials.map((t, i) => (
                <div key={i} style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "26px", animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}>
                  {/* read-only stars — no onRate passed */}
                  <StarRating score={t.score} />
                  <h4 style={{ fontFamily: SERIF, fontSize: "16px", fontWeight: "600", color: C.dark, marginBottom: "10px" }}>{t.title}</h4>
                  <p style={{ fontFamily: FONT, fontSize: "14px", color: C.muted, lineHeight: "1.7", marginBottom: "18px" }}>{t.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: "700", fontFamily: FONT }}>
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily: FONT, fontSize: "13px", fontWeight: "600", color: C.text }}>{t.name}</div>
                      <div style={{ fontFamily: FONT, fontSize: "11px", color: C.muted }}>✓ Verified purchase</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <button
                className="btn-teal"
                onClick={() => setShowReviewModal(true)}
                style={{ background: C.teal, color: "#fff", border: "none", padding: "13px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: FONT, transition: "background 0.2s" }}
              >
                Write a review
              </button>
            </div>
          </div>
        </section>

        {/* ── BACK TO TOP ─────────────────────────────────── */}
        {showBackToTop && (
          <button
            className="back-to-top"
            onClick={scrollToTop}
            title="Back to top"
            style={{ position: "fixed", bottom: "28px", right: "28px", width: "46px", height: "46px", borderRadius: "50%", background: C.teal, color: "#fff", border: "none", cursor: "pointer", fontSize: "18px", boxShadow: "0 4px 20px rgba(0,0,0,0.22)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", animation: "popIn 0.25s ease", fontFamily: FONT }}
          >
            ↑
          </button>
        )}

        {/* ── QUANTITY MODAL ──────────────────────────────── */}
        {showPopup && selectedProduct && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,10,30,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" }}>
            <div style={{ background: C.white, padding: "36px", width: "100%", maxWidth: "420px", borderRadius: "16px", boxShadow: "0 32px 80px rgba(0,0,0,0.28)", animation: "popIn 0.25s ease" }}>
              <h3 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: "700", color: C.dark, marginBottom: "6px" }}>Choose quantity</h3>
              <p style={{ fontFamily: FONT, fontSize: "14px", color: C.muted, marginBottom: "28px" }}>
                How many of <strong style={{ color: C.dark }}>{selectedProduct.name}</strong> would you like?
              </p>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", marginBottom: "16px" }}>
                <button
                  className="btn-outline"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: "44px", height: "44px", border: `1px solid ${C.border}`, borderRadius: "8px", cursor: "pointer", fontSize: "20px", background: C.cream, fontFamily: FONT, transition: "background 0.2s" }}
                >−</button>
                <span style={{ fontSize: "36px", fontWeight: "700", color: C.dark, fontFamily: SERIF, minWidth: "48px", textAlign: "center" }}>
                  {quantity}
                </span>
                <button
                  className="btn-outline"
                  onClick={() => setQuantity(q => q + 1)}
                  style={{ width: "44px", height: "44px", border: `1px solid ${C.border}`, borderRadius: "8px", cursor: "pointer", fontSize: "20px", background: C.cream, fontFamily: FONT, transition: "background 0.2s" }}
                >+</button>
              </div>

              <div style={{ textAlign: "center", marginBottom: "26px", padding: "14px", background: C.cream, borderRadius: "8px", border: `1px solid ${C.border}` }}>
                <span style={{ fontFamily: FONT, fontSize: "13px", color: C.muted }}>Total: </span>
                <span style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: "700", color: C.teal }}>${(selectedProduct.price * quantity).toFixed(2)}</span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="btn-outline" onClick={() => setShowPopup(false)} style={{ flex: 1, padding: "13px", border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", borderRadius: "8px", fontFamily: FONT, fontSize: "14px", transition: "background 0.2s" }}>Cancel</button>
                <button className="btn-dark" onClick={handleConfirmAdd} style={{ flex: 1, padding: "13px", background: C.dark, color: "#fff", border: "none", cursor: "pointer", borderRadius: "8px", fontWeight: "600", fontFamily: FONT, fontSize: "14px", transition: "background 0.2s" }}>Add to cart</button>
              </div>
            </div>
          </div>
        )}

        {/* ── REVIEW MODAL ────────────────────────────────── */}
        {showReviewModal && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,10,30,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, padding: "20px" }}>
            <div style={{ background: C.white, padding: "36px", width: "100%", maxWidth: "420px", borderRadius: "16px", boxShadow: "0 32px 80px rgba(0,0,0,0.28)", animation: "popIn 0.25s ease" }}>
              <h3 style={{ fontFamily: SERIF, fontSize: "22px", fontWeight: "700", color: C.dark, marginBottom: "6px" }}>Write a review</h3>
              <p style={{ fontFamily: FONT, fontSize: "13px", color: C.muted, marginBottom: "24px" }}>
                Share your experience — your feedback helps thousands of customers.
              </p>

              {/* ── INTERACTIVE STAR RATING ── */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "600", color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: "8px" }}>
                  Your rating
                </label>
                {/* onRate prop passed → becomes interactive (0 click resets to 0) */}
                <StarRating score={reviewRating} onRate={setReviewRating} />
                <span style={{ fontFamily: FONT, fontSize: "12px", color: C.muted, marginTop: "4px", display: "inline-block" }}>
                  {reviewRating === 0 && "Select a rating"}
                  {reviewRating === 1 && "★ Poor"}
                  {reviewRating === 2 && "★★ Fair"}
                  {reviewRating === 3 && "★★★ Good"}
                  {reviewRating === 4 && "★★★★ Very good"}
                  {reviewRating === 5 && "★★★★★ Excellent"}
                </span>
              </div>

              <label style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "600", color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: "6px" }}>Your name</label>
              <input
                placeholder="e.g. Sarah M."
                value={newReview.customerId}
                onChange={e => setNewReview({ ...newReview, customerId: e.target.value })}
                style={{ ...inputStyle, marginBottom: "16px" }}
              />

              <label style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "600", color: C.muted, textTransform: "uppercase", letterSpacing: "0.8px", display: "block", marginBottom: "6px" }}>Your review</label>
              <textarea
                placeholder="What did you love about your order?"
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                style={{ ...inputStyle, height: "110px", resize: "none", marginBottom: "22px" }}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn-outline"
                  onClick={() => { setShowReviewModal(false); setNewReview({ customerId: "", comment: "" }); setReviewRating(5); }}
                  style={{ flex: 1, padding: "13px", border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", borderRadius: "8px", fontFamily: FONT, fontSize: "14px", transition: "background 0.2s" }}
                >
                  Cancel
                </button>
                <button
                  className="btn-teal"
                  onClick={handleSubmitReview}
                  style={{ flex: 1, padding: "13px", background: C.teal, color: "#fff", border: "none", cursor: "pointer", borderRadius: "8px", fontWeight: "600", fontFamily: FONT, fontSize: "14px", transition: "background 0.2s" }}
                >
                  Submit review
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
</>
  );
};

export default Homepage;