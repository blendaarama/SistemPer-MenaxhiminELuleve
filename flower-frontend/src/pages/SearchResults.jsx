import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext.jsx";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";

const C = {
  dark:   "#0F0A1E",
  teal:   "#0D5C5C",
  tealLt: "#0A4A4A",
  cream:  "#FAF8F5",
  white:  "#FFFFFF",
  border: "#E8E2D9",
  text:   "#1A1A2E",
  muted:  "#6B7280",
  red:    "#C0392B",
};

const FONT  = "'DM Sans', system-ui, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

/* skeleton card */
const SkeletonCard = () => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden" }}>
    <div style={{ height: "220px", background: "linear-gradient(90deg, #f0ede8 25%, #e8e3dd 50%, #f0ede8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
    <div style={{ padding: "16px" }}>
      {[65, 45, 30].map((w, i) => (
        <div key={i} style={{ height: "12px", width: `${w}%`, background: "linear-gradient(90deg, #f0ede8 25%, #e8e3dd 50%, #f0ede8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", borderRadius: "4px", marginBottom: "10px" }} />
      ))}
    </div>
  </div>
);

const SearchResults = () => {
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [searchInput, setSearchInput] = useState("");

  const location = useLocation();
  const navigate  = useNavigate();
  const { addToCart } = useCart();

  /* read ?query= from URL */
  const query = new URLSearchParams(location.search).get("query") || "";

  /* keep local input in sync when URL changes */
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  /* fetch on query change */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");

    axios
      .get(`http://localhost:8080/api/products/search?q=${encodeURIComponent(query)}`)
      .then(res => setResults(res.data))
      .catch(err => {
        console.error("Search error:", err);
        setError("Could not fetch results. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [query]);

  /* inline search inside the results page */
  const handleSearch = e => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    navigate(`/search?query=${encodeURIComponent(q)}`);
  };

  /* ── RENDER ─────────────────────────────────────── */
  return (
    <>
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_URL} rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: ${FONT}; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .result-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .result-card:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,0.10) !important; }
        input::placeholder { color: #aaa; }
        input:focus { outline: none; border-color: ${C.teal} !important; box-shadow: 0 0 0 3px rgba(13,92,92,0.12); }
      `}</style>

      <div style={{ fontFamily: FONT, background: C.cream, minHeight: "100vh", color: C.text }}>

        {/* ── TOP BAR ──────────────────────────────────── */}
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "20px 6%" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: FONT, fontSize: "12px", color: C.muted, marginBottom: "16px" }}>
              <Link to="/" style={{ color: C.teal, textDecoration: "none", fontWeight: "500" }}>Home</Link>
              <span>›</span>
              <span>Search results</span>
              {query && (
                <>
                  <span>›</span>
                  <span style={{ color: C.text, fontWeight: "500" }}>"{query}"</span>
                </>
              )}
            </div>

            {/* search bar */}
            <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: "560px", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search flowers, bouquets, gifts…"
                style={{ flex: 1, padding: "13px 18px", border: `1px solid ${C.border}`, borderRight: "none", borderRadius: "10px 0 0 10px", fontFamily: FONT, fontSize: "14px", color: C.text, background: C.white, transition: "border-color 0.2s" }}
              />
              <button
                type="submit"
                style={{ background: C.teal, color: "#fff", border: "none", padding: "13px 24px", fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap", borderRadius: "0 10px 10px 0", transition: "background 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.tealLt}
                onMouseLeave={e => e.currentTarget.style.background = C.teal}
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* ── RESULTS AREA ─────────────────────────────── */}
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 6%" }}>

          {/* heading */}
          {query && (
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontFamily: SERIF, fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "700", color: C.dark, marginBottom: "6px" }}>
                {loading ? "Searching…" : `Results for "${query}"`}
              </h1>
              {!loading && !error && (
                <p style={{ fontFamily: FONT, fontSize: "13px", color: C.muted }}>
                  {results.length === 0
                    ? "No products found."
                    : `${results.length} product${results.length !== 1 ? "s" : ""} found`}
                </p>
              )}
            </div>
          )}

          {/* empty query state */}
          {!query && (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "26px", fontWeight: "700", color: C.dark, marginBottom: "10px" }}>What are you looking for?</h2>
              <p style={{ fontFamily: FONT, fontSize: "14px", color: C.muted, maxWidth: "380px", margin: "0 auto" }}>
                Type a keyword above to search our collection of flowers, bouquets, and gifts.
              </p>
            </div>
          )}

          {/* loading skeletons */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* error state */}
          {error && !loading && (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "#FEF2F2", borderRadius: "12px", border: "1px solid #FECACA" }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>⚠️</div>
              <p style={{ fontFamily: FONT, color: C.red, fontWeight: "500", marginBottom: "16px" }}>{error}</p>
              <button
                onClick={() => navigate(0)}
                style={{ padding: "10px 22px", borderRadius: "8px", border: `1px solid ${C.border}`, background: "transparent", cursor: "pointer", fontFamily: FONT, fontSize: "13px" }}
              >
                Try again
              </button>
            </div>
          )}

          {/* no results */}
          {!loading && !error && query && results.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌱</div>
              <h2 style={{ fontFamily: SERIF, fontSize: "24px", fontWeight: "700", color: C.dark, marginBottom: "10px" }}>No results found</h2>
              <p style={{ fontFamily: FONT, fontSize: "14px", color: C.muted, marginBottom: "28px", maxWidth: "380px", margin: "0 auto 28px" }}>
                We couldn't find any products matching "{query}". Try a different keyword or browse our collection.
              </p>
              <Link
                to="/"
                style={{ display: "inline-block", background: C.teal, color: "#fff", padding: "13px 28px", borderRadius: "8px", fontFamily: FONT, fontSize: "14px", fontWeight: "600", textDecoration: "none" }}
              >
                Back to homepage
              </Link>
            </div>
          )}

          {/* results grid */}
          {!loading && !error && results.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
              {results.map((product, i) => (
                <div
                  key={product.id}
                  className="result-card"
                  style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}
                >
                  {/* product image */}
                  <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                   <img
  src={product.imageUrl || "https://images.unsplash.com/photo-1490750967868-88df5691cc51?w=400"}
  alt={product.name}
  onError={e => { 
    e.target.onerror = null; 
    e.target.src = "https://images.unsplash.com/photo-1490750967868-88df5691cc51?w=400"; 
  }}
  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
/>
                    {product.occasion && (
                      <span style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(15,10,30,0.72)", color: "#fff", fontSize: "10px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", padding: "3px 9px", borderRadius: "20px", fontFamily: FONT }}>
                        {product.occasion}
                      </span>
                    )}
                  </div>

                  {/* product info */}
                  <div style={{ padding: "18px" }}>
                    <div style={{ fontFamily: FONT, fontSize: "10px", fontWeight: "600", color: C.muted, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
                      {product.category || "Fresh Arrangement"}
                    </div>
                    <h3 style={{ fontFamily: SERIF, fontSize: "17px", fontWeight: "600", color: C.dark, marginBottom: "6px", lineHeight: "1.3" }}>
                      {product.name}
                    </h3>
                    {product.description && (
                      <p style={{ fontFamily: FONT, fontSize: "13px", color: C.muted, lineHeight: "1.6", marginBottom: "14px",
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {product.description}
                      </p>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                      <span style={{ fontFamily: FONT, fontSize: "20px", fontWeight: "700", color: C.dark }}>
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span style={{ fontFamily: FONT, fontSize: "12px", color: C.muted, textDecoration: "line-through" }}>
                          ${product.originalPrice}
                        </span>
                      )}
                      <span style={{ fontFamily: FONT, fontSize: "11px", color: "#16a34a", fontWeight: "600" }}>✓ In stock</span>
                    </div>

                    <button
                      onClick={() => addToCart(product, 1)}
                      style={{ width: "100%", padding: "11px", background: C.dark, color: "#fff", border: "none", borderRadius: "8px", fontFamily: FONT, fontSize: "13px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.3px", transition: "background 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1a0f33"}
                      onMouseLeave={e => e.currentTarget.style.background = C.dark}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;