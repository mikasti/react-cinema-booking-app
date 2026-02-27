import { http, HttpResponse } from "msw";

import { IMovie, UserBooking, IMovieSession, ICinema } from "../types/AppTypes";
import { API_BASE_URL } from "../api/apiConstants";

type MockSession = IMovieSession & {
  seats: { rows: number; seatsPerRow: number };
};

const mockMovies: IMovie[] = [
  {
    id: 1,
    title: "Мстители",
    description: "Эпическая битва...",
    year: 2012,
    lengthMinutes: 140,
    posterImage: "",
    rating: 4.21,
  },
  {
    id: 2,
    title: "Темный рыцарь",
    description: "Бэтмен против Джокера...",
    year: 2008,
    lengthMinutes: 152,
    posterImage: "",
    rating: 4.79,
  },
];

const mockCinemas: ICinema[] = [
  { id: 1, name: "Skyline Cinema", address: "Ул. Пушкина, 10" },
  { id: 2, name: "Салют", address: "Пр. Ленина, 25" },
];

const mockSessions: MockSession[] = [
  {
    id: 101,
    movieId: 1,
    cinemaId: 1,
    startTime: "2026-07-24T15:30:00Z",
    seats: { rows: 5, seatsPerRow: 8 },
  },
  {
    id: 102,
    movieId: 1,
    cinemaId: 2,
    startTime: "2026-07-24T18:30:00Z",
    seats: { rows: 5, seatsPerRow: 8 },
  },
  {
    id: 103,
    movieId: 2,
    cinemaId: 1,
    startTime: "2026-07-24T20:30:00Z",
    seats: { rows: 5, seatsPerRow: 8 },
  },
  {
    id: 104,
    movieId: 2,
    cinemaId: 2,
    startTime: "2026-07-25T14:00:00+03:00",
    seats: { rows: 5, seatsPerRow: 8 },
  },
];

const mockBookings: UserBooking[] = [
  {
    id: "b1",
    userId: 1,
    movieSessionId: 101,
    sessionId: 101,
    bookedAt: new Date().toISOString(),
    seats: [
      { rowNumber: 1, seatNumber: 1 },
      { rowNumber: 1, seatNumber: 2 },
    ],
    isPaid: false,
    movieTitle: "Мстители",
    cinemaName: "Skyline Cinema",
    startTime: "2026-07-24T15:30:00Z",
  },
  {
    id: "b_past",
    userId: 1,
    movieSessionId: 102,
    sessionId: 102,
    bookedAt: "2024-01-01T10:00:00Z",
    seats: [{ rowNumber: 3, seatNumber: 5 }],
    isPaid: true,
    movieTitle: "Темный рыцарь",
    cinemaName: "Салют",
    startTime: "2024-01-01T12:00:00Z",
  },
];

function isValidSeat(seat: unknown): boolean {
  if (typeof seat !== "object" || seat === null) {
    return false;
  }

  if (
    !Object.prototype.hasOwnProperty.call(seat, "rowNumber") ||
    !Object.prototype.hasOwnProperty.call(seat, "seatNumber")
  ) {
    return false;
  }

  const { rowNumber, seatNumber } = seat as {
    rowNumber: unknown;
    seatNumber: unknown;
  };

  if (
    typeof rowNumber !== "number" ||
    typeof seatNumber !== "number" ||
    !Number.isFinite(rowNumber) ||
    !Number.isFinite(seatNumber)
  ) {
    return false;
  }

  return rowNumber > 0 && seatNumber > 0;
}

function isValidSeats(
  seats: unknown,
  rowsNumber: number,
  seatsPerRow: number,
): boolean {
  if (!Array.isArray(seats)) {
    return false;
  }

  if (!seats.length) {
    return false;
  }

  return seats.every(
    (seat) =>
      isValidSeat(seat) &&
      (seat as { rowNumber: number }).rowNumber <= rowsNumber &&
      (seat as { seatNumber: number }).seatNumber <= seatsPerRow,
  );
}

export const mockHandlers = [
  http.post(`${API_BASE_URL}/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (username === "admin" && password === "Password123") {
      return HttpResponse.json({ token: "fake-jwt-token" });
    }

    return new HttpResponse(
      JSON.stringify({
        message:
          "Неверный логин или пароль. Проверьте введенные данные и попробуйте снова",
      }),
      { status: 401 },
    );
  }),

  http.post(`${API_BASE_URL}/register`, async () => {
    return HttpResponse.json({ token: "fake-jwt-token-new" });
  }),

  http.get(`${API_BASE_URL}/movies`, () => {
    return HttpResponse.json(mockMovies);
  }),

  http.get(`${API_BASE_URL}/movies/:movieId/sessions`, ({ params }) => {
    const { movieId } = params;
    const sessions = mockSessions.filter((s) => s.movieId === Number(movieId));
    return HttpResponse.json(sessions);
  }),

  http.get(`${API_BASE_URL}/cinemas`, () => {
    return HttpResponse.json(mockCinemas);
  }),

  http.get(`${API_BASE_URL}/cinemas/:cinemaId/sessions`, ({ params }) => {
    const { cinemaId } = params;
    const sessions = mockSessions.filter(
      (s) => s.cinemaId === Number(cinemaId),
    );
    return HttpResponse.json(sessions);
  }),

  http.get(`${API_BASE_URL}/movieSessions/:movieSessionId`, ({ params }) => {
    const { movieSessionId } = params;
    const session = mockSessions.find((s) => s.id === Number(movieSessionId));
    if (!session) return new HttpResponse(null, { status: 404 });

    const movie = mockMovies.find((m) => m.id === session.movieId);
    const cinema = mockCinemas.find((c) => c.id === session.cinemaId);

    if (!movie || !cinema) {
      return new HttpResponse(null, { status: 404 });
    }

    const sessionBookings = mockBookings.filter(
      (b) => b.movieSessionId === session.id,
    );
    const bookedSeats = sessionBookings.flatMap((b) => b.seats);

    return HttpResponse.json({
      id: session.id,
      movieId: session.movieId,
      cinemaId: session.cinemaId,
      startTime: session.startTime,
      seats: session.seats,
      bookedSeats,
    });
  }),

  http.post(
    `${API_BASE_URL}/movieSessions/:movieSessionId/bookings`,
    async ({ params, request }) => {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return HttpResponse.json({ message: "Доступ запрещен" }, { status: 403 });
      }

      const { movieSessionId } = params;
      const sessionId = Number(movieSessionId);
      const session = mockSessions.find((s) => s.id === sessionId);

      if (!session) {
        return HttpResponse.json({ message: "Сеанс не найден" }, { status: 404 });
      }

      const body = (await request.json()) as {
        seats: { rowNumber: number; seatNumber: number }[];
      };
      const { seats } = body;

      if (!isValidSeats(seats, session.seats.rows, session.seats.seatsPerRow)) {
        return HttpResponse.json(
          { message: "Неверное тело запроса" },
          { status: 400 },
        );
      }

      const hasConflictedBooking = mockBookings.find(
        (booking) =>
          booking.movieSessionId === sessionId &&
          booking.seats.some((bookedSeat) =>
            seats.find(
              ({ rowNumber, seatNumber }) =>
                bookedSeat.rowNumber === rowNumber &&
                bookedSeat.seatNumber === seatNumber,
            ),
          ),
      );

      if (hasConflictedBooking) {
        return HttpResponse.json(
          { message: "Места уже забронированы" },
          { status: 409 },
        );
      }

      const movie = mockMovies.find((m) => m.id === session.movieId);
      const cinema = mockCinemas.find((c) => c.id === session.cinemaId);

      const newBooking: UserBooking = {
        id: `b${Date.now()}`,
        userId: 1, // Mock user ID
        movieSessionId: sessionId,
        sessionId: sessionId,
        bookedAt: new Date().toISOString(),
        seats: seats,
        isPaid: false,
        movieTitle: movie?.title || "Неизвестный фильм",
        cinemaName: cinema?.name || "Неизвестный кинотеатр",
        startTime: session.startTime,
      };

      mockBookings.push(newBooking);

      return HttpResponse.json({ bookingId: newBooking.id });
    },
  ),

  http.get(`${API_BASE_URL}/settings`, () => {
    return HttpResponse.json({ bookingPaymentTimeSeconds: 180 });
  }),

  http.get(`${API_BASE_URL}/me/bookings`, () => {
    return HttpResponse.json(mockBookings);
  }),

  http.post(`${API_BASE_URL}/bookings/:bookingId/payments`, ({ params }) => {
    const { bookingId } = params;
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.isPaid = true;
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
