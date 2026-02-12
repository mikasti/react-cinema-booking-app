import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MovieSessionsPage from "../components/pages/movies/MovieSessionsPage";
import { IMovie } from "../types/AppTypes";
import { useMovieSessions } from "../hooks/useMovieSessions";

jest.mock("../hooks/useMovieSessions");

const mockMovie: IMovie = {
  id: 1,
  title: "Test Movie",
  posterImage: "test.jpg",
  rating: 8.5,
  year: 2023,
  lengthMinutes: 120,
  description: "A test movie",
};

const mockDaySessions = [
  {
    date: "01.11",
    cinemas: [
      {
        cinemaId: 1,
        cinemaName: "Cinema One",
        cinemaAddress: "Address 1",
        sessions: [
          {
            id: 101,
            movieId: 1,
            cinemaId: 1,
            startTime: "2023-11-01T10:00:00.000Z",
          },
        ],
      },
      {
        cinemaId: 2,
        cinemaName: "Cinema Two",
        cinemaAddress: "Address 2",
        sessions: [
          {
            id: 102,
            movieId: 1,
            cinemaId: 2,
            startTime: "2023-11-01T12:00:00.000Z",
          },
        ],
      },
    ],
  },
];

describe("MovieSessionsPage Filter", () => {
  beforeEach(() => {
    (useMovieSessions as jest.Mock).mockReturnValue({
      daySessions: mockDaySessions,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should filter sessions by cinema when fromCinemaId is present in state", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/movie/1",
            state: { movie: mockMovie, fromCinemaId: "1" },
          },
        ]}
      >
        <Routes>
          <Route path="/movie/:id" element={<MovieSessionsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();

    expect(screen.getByText("Cinema One")).toBeInTheDocument();

    expect(screen.getByText("Address 1")).toBeInTheDocument();

    expect(screen.queryByText("Cinema Two")).not.toBeInTheDocument();

    expect(screen.getByText("Показать все кинотеатры")).toBeInTheDocument();
  });

  it("should show all cinemas when filter is cleared", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/movie/1",
            state: { movie: mockMovie, fromCinemaId: "1" },
          },
        ]}
      >
        <Routes>
          <Route path="/movie/:id" element={<MovieSessionsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.queryByText("Cinema Two")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Показать все кинотеатры"));

    expect(screen.getByText("Cinema Two")).toBeInTheDocument();
    expect(screen.getByText("Address 2")).toBeInTheDocument();

    expect(
      screen.queryByText("Показать все кинотеатры"),
    ).not.toBeInTheDocument();
  });

  it("should show all cinemas by default if no filter is provided", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/movie/1",
            state: { movie: mockMovie },
          },
        ]}
      >
        <Routes>
          <Route path="/movie/:id" element={<MovieSessionsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Movie")).toBeInTheDocument();

    expect(screen.getByText("Cinema One")).toBeInTheDocument();
    expect(screen.getByText("Address 1")).toBeInTheDocument();
    expect(screen.getByText("Cinema Two")).toBeInTheDocument();
    expect(screen.getByText("Address 2")).toBeInTheDocument();

    expect(
      screen.queryByText("Показать все кинотеатры"),
    ).not.toBeInTheDocument();
  });
});
