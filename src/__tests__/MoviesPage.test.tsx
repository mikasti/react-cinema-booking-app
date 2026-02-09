import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MoviesPage from "../components/pages/movies/MoviesPage";
import { cinemaApi } from "../api/cinemaApi";

jest.mock("../api/cinemaApi", () => ({
  cinemaApi: {
    getMovies: jest.fn(),
  },
}));

describe("MoviesPage", () => {
  it("renders movie list fetched from API", async () => {
    const mockMovies = [
      { id: 1, title: "Test Movie 1", rating: 4.5, posterImage: "" },
      { id: 2, title: "Test Movie 2", rating: 3.8, posterImage: "" },
    ];
    (cinemaApi.getMovies as jest.Mock).mockResolvedValue(mockMovies);

    const { getByText } = render(
      <MemoryRouter>
        <MoviesPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getByText("Test Movie 1")).toBeInTheDocument();
      expect(getByText("Test Movie 2")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    (cinemaApi.getMovies as jest.Mock).mockReturnValue(new Promise(() => {}));
    const { getByText } = render(
      <MemoryRouter>
        <MoviesPage />
      </MemoryRouter>,
    );

    expect(getByText("Загрузка...")).toBeInTheDocument();
  });
});
