export interface ILoginRequest {
  username: string;
  password: string;
}

export type TRegisterRequest = ILoginRequest;

export interface ILoginResponse {
  token: string;
}

export interface IErrorResponse {
  message: string;
  error: string;
}

export interface ICinema {
  id: number;
  name: string;
  address: string;
}

export interface IMovie {
  id: number;
  title: string;
  description: string;
  year: number;
  lengthMinutes: number;
  posterImage: string;
  rating: number;
}

export interface IMovieSession {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
}

export interface ISeat {
  rowNumber: number;
  seatNumber: number;
}

export interface SessionDetails {
  id: number;
  movieId: number;
  cinemaId: number;
  startTime: string;
  seats: {
    rows: number;
    seatsPerRow: number;
  };
  bookedSeats: ISeat[];
}

export interface BookingRequest {
  seats: ISeat[];
}
export interface IBookingResponse {
  bookingId: string;
}
export interface ISettingsResponse {
  bookingPaymentTimeSeconds: number;
}

export interface UserBooking {
  id: string;
  userId: number;
  movieSessionId: number;
  sessionId: number;
  bookedAt: string;
  seats: ISeat[];
  isPaid: boolean;
  movieTitle?: string;
  cinemaName?: string;
  startTime?: string;
  movieSession?: IMovieSession;
}

export interface CinemaWithSessions {
  cinemaName: string;
  cinemaId: number;
  cinemaAddress: string;
  sessions: IMovieSession[];
}

export interface DaySessions {
  date: string;
  cinemas: CinemaWithSessions[];
}

export interface SessionGroupItem {
  id: number | string;
  title: string;
  subtitle?: string;
  sessions: IMovieSession[];
  onTitleClick?: () => void;
}

export interface DateGroup {
  date: string;
  items: SessionGroupItem[];
}

export type TicketStatus = "unpaid" | "paid" | "past";
