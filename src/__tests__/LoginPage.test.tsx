import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../components/pages/login/LoginPage";
import { AuthProvider } from "../context/AuthContext";

jest.mock("../api/cinemaApi", () => ({
  cinemaApi: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

describe("LoginPage", () => {
  it("renders login form by default", () => {
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    expect(getByPlaceholderText("Введите логин")).toBeInTheDocument();
    expect(getByPlaceholderText("Введите пароль")).toBeInTheDocument();
    expect(getByText("Войти")).toBeInTheDocument();
  });

  it("shows error if fields are empty", async () => {
    const { getByText } = render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    fireEvent.click(getByText("Войти"));

    await waitFor(() => {
      expect(
        getByText("Username must be at least 8 characters"),
      ).toBeInTheDocument();
    });
  });

  it("toggles to registration form", () => {
    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>,
    );

    fireEvent.click(getByText("зарегистрируйтесь"));

    expect(getByPlaceholderText("Повторите пароль")).toBeInTheDocument();
    expect(getByText("Зарегистрироваться")).toBeInTheDocument();
  });
});
