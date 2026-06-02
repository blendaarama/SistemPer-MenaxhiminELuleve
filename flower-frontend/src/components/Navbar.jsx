import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
 const [search, setSearch] = useState("");
 const navigate = useNavigate();
 const { cartItems } = useCart();

 // ✅ State për login dhe role — ri-renderohet kur ndryshon
 const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("accessToken")));
 const [role, setRole] = useState(localStorage.getItem("role"));

 // ✅ Degjojë ndryshimet e localStorage
 useEffect(() => {
 const handleStorage = () => {
 setIsLoggedIn(Boolean(localStorage.getItem("accessToken")));
 setRole(localStorage.getItem("role"));
 };

 window.addEventListener("storage", handleStorage);
 
 // ✅ Kjo është kyçe — dëgjon edhe ndryshimet brenda të njëjtit tab
 window.addEventListener("localStorageChange", handleStorage);

 return () => {
 window.removeEventListener("storage", handleStorage);
 window.removeEventListener("localStorageChange", handleStorage);
 };
 }, []);

 const handleSearch = (e) => {
 e.preventDefault();
 const q = search.trim();
 if (!q) return;
 navigate(`/search?query=${encodeURIComponent(q)}`);
 setSearch("");
 };

 const handleLogout = () => {
 localStorage.removeItem("accessToken");
 localStorage.removeItem("refreshToken");
 localStorage.removeItem("userEmail");
 localStorage.removeItem("role");
 // ✅ Update state menjëherë
 setIsLoggedIn(false);
 setRole(null);
 navigate("/");
 };

 const linkStyle = {
 color: "#1F1F1F",
 textDecoration: "none",
 fontSize: "12px",
 fontWeight: "600",
 textTransform: "uppercase",
 letterSpacing: "1px",
 transition: "color 0.2s",
 };

 const hoverOn = (e) => (e.currentTarget.style.color = "#0E5A5B");
 const hoverOff = (e) => (e.currentTarget.style.color = "#1F1F1F");

 return (
 <nav
 className="navbar navbar-expand-xl navbar-light sticky-top py-3"
 style={{
 background: "#FFFFFF",
 borderBottom: "1px solid #E6E0D8",
 width: "100%",
 boxSizing: "border-box",
 zIndex: 1050,
 }}
 >
 <div
 className="container-fluid px-4 px-md-5"
 style={{ maxWidth: "1400px", margin: "0 auto" }}
 >
 <Link
 className="navbar-brand d-flex align-items-center gap-2 m-0"
 to="/"
 style={{
 color: "#2C1A4A",
 fontSize: "1.6rem",
 fontWeight: "700",
 letterSpacing: "-0.5px",
 fontFamily: "Georgia, serif",
 textDecoration: "none",
 }}
 >
 Eternal Rose
 </Link>

 <button
 className="navbar-toggler border-0"
 type="button"
 data-bs-toggle="collapse"
 data-bs-target="#nav"
 style={{ boxShadow: "none" }}
 >
 <span className="navbar-toggler-icon" />
 </button>

 <div className="collapse navbar-collapse" id="nav">
 <div
 className="mx-auto my-3 my-xl-0 d-flex justify-content-center"
 style={{ width: "100%", maxWidth: "550px" }}
 >
 <form
 onSubmit={handleSearch}
 className="d-flex w-100"
 style={{ position: "relative" }}
 >
 <input
 className="form-control px-4"
 type="search"
 placeholder="What are you looking for?"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 style={{
 borderRadius: "4px 0 0 4px",
 border: "1px solid #C4B9AF",
 borderRight: "none",
 fontSize: "14px",
 boxShadow: "none",
 backgroundColor: "#FAF8F5",
 color: "#1F1F1F",
 width: "100%",
 padding: "10px 16px",
 outline: "none",
 }}
 />
 <button
 type="submit"
 style={{
 background: "#2B1A4A",
 color: "#FFFFFF",
 border: "none",
 padding: "0 24px",
 borderRadius: "0 4px 4px 0",
 fontSize: "12px",
 fontWeight: "600",
 letterSpacing: "1px",
 textTransform: "uppercase",
 cursor: "pointer",
 transition: "background 0.2s",
 whiteSpace: "nowrap",
 }}
 onMouseEnter={(e) => (e.currentTarget.style.background = "#0E5A5B")}
 onMouseLeave={(e) => (e.currentTarget.style.background = "#2B1A4A")}
 >
 Search
 </button>
 </form>
 </div>

 <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap">

 <Link to="/" style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
 Home
 </Link>

 {isLoggedIn && role === "ROLE_ADMIN" && (
 <Link to="/admin/dashboard" style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
 Admin Panel
 </Link>
 )}
 {isLoggedIn && role === "ROLE_STAFF" && (
 <Link to="/staff/orders" style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
 Porositë
 </Link>
 )}
 {isLoggedIn && role === "ROLE_MODERATOR" && (
 <Link to="/reviews" style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
 Reviews
 </Link>
 )}

 {isLoggedIn ? (
 <button
 onClick={handleLogout}
 style={{
 background: "transparent",
 border: "none",
 color: "#1F1F1F",
 cursor: "pointer",
 fontSize: "12px",
 fontWeight: "600",
 textTransform: "uppercase",
 letterSpacing: "1px",
 padding: 0,
 transition: "color 0.2s",
 }}
 onMouseEnter={hoverOn}
 onMouseLeave={hoverOff}
 >
 Logout
 </button>
 ) : (
 <Link to="/login" style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
 Sign In
 </Link>
 )}

 <Link to="/order" style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
 Cart ({cartItems.length})
 </Link>

 </div>
 </div>
 </div>
 </nav>
 );
};

export default Navbar;