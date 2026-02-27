import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookingPage from "../components/pages/booking/BookingPage";
import { AuthProvider } from "../context/AuthContext";

// We use the real AuthProvider but mock localStorage to simulate logged-in state.
// The setupTests.ts mocks localStorage methods with jest.fn()

describe("BookingPage Integration", () => {
    beforeEach(() => {
        (window.localStorage.getItem as jest.Mock).mockImplementation((key) => {
            if (key === 'token') return 'fake-token';
            return null;
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("successfully books a session", async () => {
        render(
            <AuthProvider>
                <MemoryRouter initialEntries={["/movieSessions/101"]}>
                    <Routes>
                        <Route path="/movieSessions/:id" element={<BookingPage />} />
                        <Route path="/tickets" element={<div>Tickets Page</div>} />
                    </Routes>
                </MemoryRouter>
            </AuthProvider>
        );

        // Wait for session details to load (mock handlers return session 101 for Avengers)
        await waitFor(() => {
            expect(screen.getByText(/Мстители/i)).toBeInTheDocument();
        });

        // Wait for seats to be rendered
        await waitFor(() => {
            // We look for seats that are NOT booked
            const seats = document.querySelectorAll('.seat:not(.booked)');
            expect(seats.length).toBeGreaterThan(0);
        });

        const seats = document.querySelectorAll('.seat:not(.booked)');
        // Click on the first available seat
        fireEvent.click(seats[0]);

        // Check if "Забронировать" button is enabled
        // We need to wait for state update
        await waitFor(() => {
            const bookButton = screen.getByText("Забронировать");
            expect(bookButton).not.toBeDisabled();
        });

        const bookButton = screen.getByText("Забронировать");
        // Click Book
        fireEvent.click(bookButton);

        // Expect navigation to /tickets
        await waitFor(() => {
            expect(screen.getByText("Tickets Page")).toBeInTheDocument();
        });
    });
});
