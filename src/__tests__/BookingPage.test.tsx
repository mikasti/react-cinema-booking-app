import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookingPage from "../components/pages/booking/BookingPage";
import { AuthProvider } from "../context/AuthContext";
import { cinemaApi } from "../api/cinemaApi";

jest.mock("../api/cinemaApi", () => ({
  cinemaApi: {
    getSessionDetails: jest.fn(),
    bookSession: jest.fn(),
    getMovies: jest.fn(),
    getCinemas: jest.fn(),
  },
}));

const mockSession = {
  id: 1,
  movieId: 10,
  cinemaId: 20,
  startTime: "2026-07-24T15:30:00Z",
  seats: {
    rows: 2,
    seatsPerRow: 2,
  },
  bookedSeats: [{ rowNumber: 1, seatNumber: 1 }],
};

const mockMovies = [{ id: 10, title: "Test Movie", posterImage: "" }];
const mockCinemas = [{ id: 20, name: "Test Cinema", address: "Test Address" }];

describe("BookingPage", () => {
  it("renders seat map and session details", async () => {
    (cinemaApi.getSessionDetails as jest.Mock).mockResolvedValue(mockSession);
    (cinemaApi.getMovies as jest.Mock).mockResolvedValue(mockMovies);
    (cinemaApi.getCinemas as jest.Mock).mockResolvedValue(mockCinemas);

    const { getByText } = render(
      <MemoryRouter initialEntries={["/movieSessions/1"]}>
        <AuthProvider>
          <Routes>
            <Route path="/movieSessions/:id" element={<BookingPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getByText(/Test Movie/i)).toBeInTheDocument();
      expect(getByText(/Test Cinema/i)).toBeInTheDocument();
      expect(getByText(/Ряд 1/i)).toBeInTheDocument();
    });
  });

  it("allows selecting an available seat", async () => {
    (cinemaApi.getSessionDetails as jest.Mock).mockResolvedValue(mockSession);
    (cinemaApi.getMovies as jest.Mock).mockResolvedValue(mockMovies);
    (cinemaApi.getCinemas as jest.Mock).mockResolvedValue(mockCinemas);

    const { container } = render(
      <MemoryRouter initialEntries={["/movieSessions/1"]}>
        <AuthProvider>
          <Routes>
            <Route path="/movieSessions/:id" element={<BookingPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(container.querySelector(".seat")).toBeInTheDocument();
    });
  });
});
