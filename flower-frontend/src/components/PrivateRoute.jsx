import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({
 children,
 adminOnly = false,
 moderatorOnly = false,
 staffOnly = false,
}) => {
 const token = localStorage.getItem("accessToken");
 const role = localStorage.getItem("role");
 const location = useLocation();

 if (!token) return <Navigate to="/login" state={{ from: location }} replace />;

 if (adminOnly && role !== "ROLE_ADMIN")
 return <Navigate to="/" replace />;

 if (moderatorOnly && role !== "ROLE_MODERATOR" && role !== "ROLE_ADMIN")
 return <Navigate to="/" replace />;

 if (staffOnly && role !== "ROLE_STAFF" && role !== "ROLE_ADMIN")
 return <Navigate to="/" replace />;

 return children;
};

export default PrivateRoute;