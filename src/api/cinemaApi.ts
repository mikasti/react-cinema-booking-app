import {
  BookingRequest,
  IBookingResponse,
  ICinema,
  ILoginRequest,
  IMovie,
  TRegisterRequest,
  SessionDetails,
  ISettingsResponse,
  ILoginResponse,
  UserBooking,
  IMovieSession,
} from "../types/AppTypes";
import { makeRequest, setGlobalErrorHandler } from "./makeRequest";

export const cinemaApi = {
  login: (data: ILoginRequest) =>
    makeRequest<ILoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: TRegisterRequest) =>
    makeRequest<ILoginResponse>("/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getCinemas: () => makeRequest<ICinema[]>("/cinemas"),

  getCinemaSessions: (cinemaId: number) =>
    makeRequest<IMovieSession[]>(`/cinemas/${cinemaId}/sessions`),

  getMovies: () => makeRequest<IMovie[]>("/movies"),

  getMovieSessions: (movieId: number) =>
    makeRequest<IMovieSession[]>(`/movies/${movieId}/sessions`),

  getSessionDetails: (movieSessionId: string) =>
    makeRequest<SessionDetails>(`/movieSessions/${movieSessionId}`),

  bookSession: (movieSessionId: string, data: BookingRequest) =>
    makeRequest<IBookingResponse>(`/movieSessions/${movieSessionId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getSettings: () => makeRequest<ISettingsResponse>("/settings"),

  getMyBookings: () => makeRequest<UserBooking[]>("/me/bookings"),

  payBooking: (bookingId: string) =>
    makeRequest<void>(`/bookings/${bookingId}/payments`, { method: "POST" }),

  setGlobalErrorHandler,
};
