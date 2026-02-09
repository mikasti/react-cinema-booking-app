import React, { FC, memo } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface SidebarProps {
  isAuth: boolean;
  onLogout: () => void;
}

const Sidebar: FC<SidebarProps> = memo(({ isAuth, onLogout }) => {
  const location = useLocation();

  return (
    <aside className="layout-sidebar">
      <nav>
        <NavLink
          to="/movies"
          className={() => {
            const isActive =
              location.pathname === "/movies" ||
              location.pathname.startsWith("/movie/");
            return `nav-link ${isActive ? "active" : ""}`;
          }}
        >
          Фильмы
        </NavLink>
        <NavLink
          to="/cinemas"
          className={() => {
            const isActive =
              location.pathname === "/cinemas" ||
              location.pathname.startsWith("/cinema/");
            return `nav-link ${isActive ? "active" : ""}`;
          }}
        >
          Кинотеатры
        </NavLink>
        <NavLink
          to="/tickets"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Мои билеты
        </NavLink>
        {isAuth ? (
          <button className="nav-link logout-button" onClick={onLogout}>
            Выход
          </button>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Вход
          </NavLink>
        )}
      </nav>
    </aside>
  );
});

export default Sidebar;
