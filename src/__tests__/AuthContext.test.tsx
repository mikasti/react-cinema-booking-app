import React from "react";
import { render, act } from "@testing-library/react";
import { AuthProvider, useAuthContext } from "../context/AuthContext";
import { cinemaApi } from "../api/cinemaApi";

jest.mock("../api/cinemaApi", () => ({
  cinemaApi: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

const TestComponent = () => {
  const { isAuth, login, logout } = useAuthContext();
  const handleLogin = () => {
    login({ username: "admin", password: "Password123" });
  };

  return (
    <div>
      <div data-testid="isAuth">{isAuth.toString()}</div>

      <button onClick={handleLogin}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should initialize as not authenticated", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(getByTestId("isAuth").textContent).toBe("false");
  });

  it("should login successfully", async () => {
    (cinemaApi.login as jest.Mock).mockResolvedValue({ token: "test-token" });

    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {
      getByText("Login").click();
    });

    expect(cinemaApi.login).toHaveBeenCalledWith({
      username: "admin",
      password: "Password123",
    });
    expect(getByTestId("isAuth").textContent).toBe("true");
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "test-token");
  });

  it("should logout successfully", async () => {
    (cinemaApi.login as jest.Mock).mockResolvedValue({ token: "test-token" });

    const { getByTestId, getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {
      getByText("Login").click();
    });

    expect(getByTestId("isAuth").textContent).toBe("true");

    await act(async () => {
      getByText("Logout").click();
    });

    expect(getByTestId("isAuth").textContent).toBe("false");
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
  });
});
