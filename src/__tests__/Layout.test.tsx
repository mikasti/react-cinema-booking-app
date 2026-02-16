import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../components/common/Layout";
import { AuthProvider } from "../context/AuthContext";

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

describe("Layout Logout Navigation", () => {
    beforeEach(() => {
        window.localStorage.clear();
        jest.clearAllMocks();
    });

    it("navigates to /movies when logout is clicked", async () => {
        // Set token to simulate logged in state
        window.localStorage.setItem("token", "fake-token");

        render(
            <AuthProvider>
                <MemoryRouter initialEntries={["/some-protected-route"]}>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/some-protected-route" element={<div>Protected Content</div>} />
                        </Route>
                        <Route path="/movies" element={<div>Movies Page</div>} />
                    </Routes>
                </MemoryRouter>
            </AuthProvider>
        );

        // Check if we are logged in (Sidebar shows "Выход")
        const logoutButton = screen.getByText("Выход");
        expect(logoutButton).toBeInTheDocument();

        // Click logout
        fireEvent.click(logoutButton);

        // Expect to be on /movies
        await waitFor(() => {
            expect(screen.getByText("Movies Page")).toBeInTheDocument();
        });

        // Expect token to be removed (optional, but good to verify logout happened)
        expect(window.localStorage.getItem("token")).toBeNull();
    });
});
