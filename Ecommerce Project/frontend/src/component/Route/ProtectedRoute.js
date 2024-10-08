import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, element: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  // If loading, return null or a loading spinner
  if (loading ) {
    return null; // You might want to return a loading spinner here
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && user.role !== "admin") {
    return <Navigate to="/login" />;
  }


  return <Component {...rest} />;
};

export default ProtectedRoute;
