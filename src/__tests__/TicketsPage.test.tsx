import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TicketsPage from "../components/pages/tickets/TicketsPage";
import { cinemaApi } from "../api/cinemaApi";

jest.mock("../api/cinemaApi", () => ({
  cinemaApi: {
    getMyBookings: jest.fn(),
    getSettings: jest.fn(),
    payBooking: jest.fn(),
  },
}));

describe("TicketsPage", () => {
  const mockBookings = [
    {
      id: "b1",
      userId: 1,
      movieSessionId: 101,
      sessionId: 101,
      bookedAt: new Date().toISOString(),
      seats: [{ rowNumber: 1, seatNumber: 1 }],
      isPaid: false,
      movieTitle: "Unpaid Movie",
      cinemaName: "Cinema A",
    },
    {
      id: "b2",
      userId: 1,
      movieSessionId: 102,
      sessionId: 102,
      bookedAt: new Date().toISOString(),
      seats: [{ rowNumber: 2, seatNumber: 1 }],
      isPaid: true,
      movieTitle: "Paid Movie",
      cinemaName: "Cinema B",
      startTime: "2026-07-24T15:30:00Z",
    },
    {
      id: "b3",
      userId: 1,
      movieSessionId: 103,
      sessionId: 103,
      bookedAt: "2024-01-01T10:00:00Z",
      seats: [{ rowNumber: 3, seatNumber: 5 }],
      isPaid: true,
      movieTitle: "Past Movie",
      cinemaName: "Cinema C",
      startTime: "2024-01-01T12:00:00Z",
    },
  ];

  it("renders tickets grouped by status", async () => {
    (cinemaApi.getMyBookings as jest.Mock).mockResolvedValue(mockBookings);
    (cinemaApi.getSettings as jest.Mock).mockResolvedValue({
      bookingPaymentTimeSeconds: 600,
    });

    const { getByText } = render(
      <MemoryRouter>
        <TicketsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(getByText("Unpaid Movie")).toBeInTheDocument();
      expect(getByText("Paid Movie")).toBeInTheDocument();
    });
  });

  it("calls payBooking when Pay button is clicked", async () => {
    (cinemaApi.getMyBookings as jest.Mock).mockResolvedValue(mockBookings);
    (cinemaApi.getSettings as jest.Mock).mockResolvedValue({
      bookingPaymentTimeSeconds: 600,
    });
    (cinemaApi.payBooking as jest.Mock).mockResolvedValue(null);

    const { getByText } = render(
      <MemoryRouter>
        <TicketsPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      fireEvent.click(getByText("Оплатить"));
    });

    expect(cinemaApi.payBooking).toHaveBeenCalledWith("b1");
  });
});
