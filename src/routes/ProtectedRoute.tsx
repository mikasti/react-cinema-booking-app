import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuth } = useAuthContext();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
