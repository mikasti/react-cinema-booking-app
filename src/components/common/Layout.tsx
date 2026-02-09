import React, { useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import "../../assets/css/common/layout.scss";

import Sidebar from "./Sidebar";

export const Layout = () => {
  const { isAuth, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate("/movies");
  }, [logout, navigate]);

  return (
    <div className="layout-wrapper">
      <Sidebar isAuth={isAuth} onLogout={handleLogout} />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
};
