import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Layout } from "../components/common/Layout";
import MoviesPage from "../components/pages/movies/MoviesPage";
import MovieSessionsPage from "../components/pages/movies/MovieSessionsPage";
import CinemasPage from "../components/pages/cinema/CinemasPage";
import CinemaSessionsPage from "../components/pages/cinema/CinemaSessionsPage";
import LoginPage from "../components/pages/login/LoginPage";
import TicketsPage from "../components/pages/tickets/TicketsPage";
import BookingPage from "../components/pages/booking/BookingPage";
import ErrorPage from "../components/pages/ErrorPage";

const routerSetup = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/movies" replace /> },
      { path: "movies", element: <MoviesPage /> },
      { path: "movie/:id", element: <MovieSessionsPage /> },
      { path: "cinemas", element: <CinemasPage /> },
      { path: "cinema/:id", element: <CinemaSessionsPage /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "movieSessions/:id",
        element: (
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tickets",
        element: (
          <ProtectedRoute>
            <TicketsPage />
          </ProtectedRoute>
        ),
      },
      { path: "error", element: <ErrorPage /> },
    ],
  },
]);

export default routerSetup;
