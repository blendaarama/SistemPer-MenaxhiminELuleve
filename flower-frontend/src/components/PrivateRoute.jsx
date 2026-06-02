import React from "react";
import { Navigate } from "react-router-dom";

// Rolet e disponueshme:
// ROLE_ADMIN     — gjithçka
// ROLE_MODERATOR — vetëm reviews
// ROLE_STAFF     — vetëm porositë
// ROLE_USER      — homepage + blerje

const PrivateRoute = ({
  children,
  adminOnly      = false,
  moderatorOnly  = false,
  staffOnly      = false,
}) => {
  const token = localStorage.getItem("accessToken");
  const role  = localStorage.getItem("role");

  // Nuk është kyçur
  if (!token) return <Navigate to="/login" replace />;

  // Vetëm ADMIN
  if (adminOnly && role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  // MODERATOR ose ADMIN
  if (moderatorOnly && role !== "ROLE_MODERATOR" && role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  // STAFF ose ADMIN
  if (staffOnly && role !== "ROLE_STAFF" && role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;