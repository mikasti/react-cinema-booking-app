import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import App from "../App";
import { server } from "../__mocks__/server";
import { API_BASE_URL } from "../api/apiConstants";

beforeEach(() => {
  window.history.pushState({}, "Home", "/");
});

describe("Global Error Handler", () => {
  it("redirects to /error page when API returns 500", async () => {
    server.use(
      http.get(`${API_BASE_URL}/movies`, () => {
        return new HttpResponse(
          JSON.stringify({ message: "Internal Server Error" }),
          { status: 500 },
        );
      }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Что-то пошло не так")).toBeInTheDocument();
    });
  });

  it("redirects to /error page when Network Error occurs", async () => {
    server.use(
      http.get(`${API_BASE_URL}/movies`, () => {
        return HttpResponse.error();
      }),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Что-то пошло не так")).toBeInTheDocument();
    });
  });
});
