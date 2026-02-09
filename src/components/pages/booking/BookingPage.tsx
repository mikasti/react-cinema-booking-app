import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cinemaApi } from "../../../api/cinemaApi";
import {
  SessionDetails,
  ISeat,
  IMovie,
  ICinema,
} from "../../../types/AppTypes";
import { useAuthContext } from "../../../context/AuthContext";
import "../../../assets/css/booking/bookingPage.scss";
import Loader from "../../common/Loader";

import BookingHeader from "./components/BookingHeader";
import SeatLegend from "./components/SeatLegend";
import SeatMap from "./components/SeatMap";
import SelectedSeats from "./components/SelectedSeats";

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuth } = useAuthContext();

  const [session, setSession] = useState<SessionDetails | null>(null);
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [cinema, setCinema] = useState<ICinema | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    cinemaApi
      .getSessionDetails(id)
      .then(async (sessionData) => {
        setSession(sessionData);

        try {
          const [movies, cinemas] = await Promise.all([
            cinemaApi.getMovies(),
            cinemaApi.getCinemas(),
          ]);

          const foundMovie = movies.find((m) => m.id === sessionData.movieId);
          const foundCinema = cinemas.find(
            (c) => c.id === sessionData.cinemaId,
          );

          if (foundMovie) setMovie(foundMovie);
          if (foundCinema) setCinema(foundCinema);
        } catch (error) {
          console.error("Failed to load movie/cinema details", error);
        }
      })
      .catch((err) => {
        console.error(err);
        navigate("/error");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const toggleSeat = useCallback(
    (row: number, seat: number) => {
      if (!session) return;

      if (
        session.bookedSeats.some(
          (s) => s.rowNumber === row && s.seatNumber === seat,
        )
      ) {
        return;
      }

      setSelectedSeats((prev) => {
        const isSelected = prev.some(
          (s) => s.rowNumber === row && s.seatNumber === seat,
        );

        if (isSelected) {
          return prev.filter(
            (s) => !(s.rowNumber === row && s.seatNumber === seat),
          );
        } else {
          return [...prev, { rowNumber: row, seatNumber: seat }];
        }
      });
    },
    [session],
  );

  const handleBooking = async () => {
    if (!id) return;

    if (!isAuth) {
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) return;

    setBookingLoading(true);
    try {
      await cinemaApi.bookSession(id, { seats: selectedSeats });
      navigate("/tickets");
    } catch (error) {
      console.error("Booking failed", error);
      alert("Failed to book seats");
    } finally {
      setBookingLoading(false);
    }
  };

  const bookingButtonLabel = isAuth
    ? "Забронировать"
    : "Войти для бронирования";

  if (loading) return <Loader />;
  if (!session) return <div style={{ padding: 40 }}>Session not found</div>;

  return (
    <div className="booking-page">
      <BookingHeader
        movieTitle={movie?.title ?? ""}
        cinemaName={cinema?.name ?? ""}
        cinemaAddress={cinema?.address ?? ""}
        startTime={session.startTime}
      />

      <div className="screen"></div>

      <SeatMap
        session={session}
        selectedSeats={selectedSeats}
        onSeatClick={toggleSeat}
      />

      <SeatLegend />

      <div className="booking-actions">
        <SelectedSeats selectedSeats={selectedSeats} />

        <button
          onClick={handleBooking}
          disabled={bookingLoading || (isAuth && selectedSeats.length === 0)}
        >
          {bookingLoading ? "Бронирование..." : bookingButtonLabel}
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
