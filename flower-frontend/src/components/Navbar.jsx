import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?query=${encodeURIComponent(search)}`);
  };

  const handleLogout = () => {

  localStorage.removeItem('accessToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('role');

  navigate('/login');
};

  return (
    <nav
      className="navbar navbar-expand-xl navbar-light sticky-top py-3"
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E6E0D8",
        margin: 0,
        padding: "14px 0",
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        boxSizing: "border-box",
        zIndex: 1050
      }}
    >
      <div className="container-fluid px-4 px-md-5" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        
        {/* BRAND */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 m-0"
          to="/"
          style={{
            color: "#2C1A4A",
            fontSize: "1.6rem",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            fontFamily: "Georgia, serif",
          }}
        >
          Eternal Rose
        </Link>

        {/* TOGGLE BUTTON */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#nav"
          style={{ boxShadow: "none" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          
          {/* SEARCH BAR */}
          <div className="mx-auto my-3 my-xl-0 d-flex justify-content-center" style={{ width: "100%", maxWidth: "550px" }}>
            <form onSubmit={handleSearch} className="d-flex w-100" style={{ position: "relative" }}>
              <input
                className="form-control px-4 py-2.5"
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
                  width: "100%"
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
                  transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#0E5A5B"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#2B1A4A"}
              >
                Search
              </button>
            </form>
          </div>

          {/* RIGHT: ACCOUNT & CART SYSTEM */}
          <div className="d-flex align-items-center justify-content-center gap-4">
            
            <Link 
              className="nav-link px-2 small fw-semibold text-uppercase" 
              style={{ fontSize: "12px", color: "#1F1F1F", letterSpacing: "1px" }} 
              to="/"
            >
              Home
            </Link>

            {/* LOGIN / LOGOUT DINAMIK */}
            {localStorage.getItem('accessToken') ? (
              <button
                onClick={handleLogout}
                className="d-flex flex-column align-items-center text-decoration-none border-0 bg-transparent"
                style={{ color: "#1F1F1F", transition: "color 0.2s", cursor: "pointer" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#0E5A5B"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#1F1F1F"}
              >
                <span style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Logout</span>
              </button>
            ) : (
              <Link
                className="d-flex flex-column align-items-center text-decoration-none"
                to="/login"
                style={{ color: "#1F1F1F", transition: "color 0.2s" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#0E5A5B"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#1F1F1F"}
              >
                <span style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Sign In</span>
              </Link>
            )}

            <Link
              className="d-flex flex-column align-items-center text-decoration-none"
              to="/order"
              style={{ color: "#1F1F1F", transition: "color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#0E5A5B"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#1F1F1F"}
            >
              <span style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>Cart (0)</span>
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;