import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  bookTicketsApi,
  getSeatsByShowIdApi,
  getShowByMovieIdApi,
  getSingleMovieApi,
  initializeKhalti,
  makeSeatUnavailableApi,
} from "../../../apis/Api";
import "./BuyTickets.css";
import { Modal, Button, Card, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChair,
  faCalendar,
  faClock,
  faTicket,
  faCouch,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { format } from "date-fns";
import KhaltiCheckout from "khalti-checkout-web";

const BuyTickets = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState({});
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const fetchMovieDetails = useCallback(async () => {
    try {
      const res = await getSingleMovieApi(id);
      setMovie(res.data.movie);
    } catch (error) {
      toast.error("Failed to fetch movie details");
    }
  }, [id]);

  const fetchShows = useCallback(async () => {
    try {
      const res = await getShowByMovieIdApi(id);
      setShows(res.data.shows);
    } catch (error) {
      toast.error("Failed to fetch show details");
    }
  }, [id]);

  useEffect(() => {
    fetchMovieDetails();
    fetchShows();
  }, [fetchMovieDetails, fetchShows]);

  const handleSelectShow = (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
  };

  const handleOpenModal = async () => {
    if (selectedShow) {
      try {
        const res = await getSeatsByShowIdApi(selectedShow._id);
        setSeats(res.data.seats);
        setShowModal(true);
      } catch (error) {
        toast.error("Failed to fetch seats");
      }
    } else {
      toast.error("Please select a show to book tickets.");
    }
  };

  const handleSeatSelection = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleOpenConfirmationModal = () => {
    if (selectedSeats.length > 0) {
      setShowConfirmationModal(true);
      setShowModal(false);
    } else {
      toast.error("Please select at least one seat.");
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedSeats([]);
    setSeats([]);
  };

  const handleProceedToPayment = async () => {
    if (selectedShow && selectedSeats.length > 0) {
      const totalAmount = selectedShow.showPrice * selectedSeats.length;
      const priceInPaise = parseInt(totalAmount * 100);

      const data = {
        show: selectedShow._id,
        seats: selectedSeats,
        price: totalAmount,
      };

      try {
        const bookingRes = await bookTicketsApi(data);
        toast.success(bookingRes.data.message);

        const khaltiConfig = {
          itemId: bookingRes.data.id,
          totalPrice: priceInPaise,
          website_url: "http://localhost:3000",
        };

        const khaltiRes = await initializeKhalti(khaltiConfig);
        window.location.href = khaltiRes.data.payment_url;

        // Update seat availability after successful booking
        await makeSeatUnavailableApi(data);

        // Close confirmation modal after booking
        handleCloseConfirmationModal();
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          console.log(error);
          toast.error("Something went wrong!");
        }
      }
    } else {
      toast.error(
        "Please select a show and at least one seat to proceed to payment."
      );
    }
  };

  const renderSeats = () => (
    <div className="seat-grid">
      {seats.map((seat) => (
        <button
          key={seat._id}
          className={`seat-button ${
            selectedSeats.includes(seat) ? "selected" : ""
          } ${!seat.available ? "unavailable" : ""}`}
          disabled={!seat.available}
          onClick={() => handleSeatSelection(seat)}
        >
          <FontAwesomeIcon icon={faCouch} />
          <span>{seat.seatNo}</span>
        </button>
      ))}
    </div>
  );

  const groupedShows = shows.reduce((acc, show) => {
    const { showDate } = show;
    if (!acc[showDate]) {
      acc[showDate] = [];
    }
    acc[showDate].push(show);
    return acc;
  }, {});

  return (
    <div className="container my-5 pt-5">
      <div className="row">
        <div className="col-md-4">
          <Card className="movie-card">
            <Card.Img
              variant="top"
              src={`http://localhost:5000/movies/${movie.moviePosterImage}`}
              alt={movie.movieName}
            />
            <Card.Body>
              <Card.Title>{movie.movieName}</Card.Title>
              <Card.Text>
                <Badge bg="info">{movie.movieGenre}</Badge>{" "}
                <Badge bg="warning">{movie.movieRated}</Badge>
              </Card.Text>
              <Card.Text>{movie.movieDetails}</Card.Text>
              <Card.Text>Duration: {movie.movieDuration} </Card.Text>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-8">
          <h2 className="mb-4">Available Shows</h2>

          {Object.entries(groupedShows).map(([date, dateShows]) => (
            <div key={date} className="mb-4">
              <h3>
                <FontAwesomeIcon icon={faCalendar} />{" "}
                {format(new Date(date), "MMMM dd, yyyy")}
              </h3>
              <div className="row">
                {dateShows.map((show) => (
                  <div key={show._id} className="col-md-4 mb-3">
                    <Card
                      className={`show-card ${
                        selectedShow?._id === show._id ? "selected" : ""
                      }`}
                      onClick={() => handleSelectShow(show)}
                    >
                      <Card.Body>
                        <Card.Title>
                          <FontAwesomeIcon icon={faClock} /> {show.showTime}
                        </Card.Title>
                        <Card.Text>
                          <FontAwesomeIcon icon={faTicket} /> Price: Rs.
                          {show.showPrice}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button
            variant="primary"
            size="lg"
            className="mt-4"
            onClick={handleOpenModal}
          >
            Select Seats
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Your Seats</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="screen-container">
            <div className="screen">Screen</div>
          </div>
          {renderSeats()}
          <div className="seat-legend mt-4">
            <span className="seat-type available">Available</span>
            <span className="seat-type selected">Selected</span>
            <span className="seat-type unavailable">Unavailable</span>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleOpenConfirmationModal}>
            Confirm Selection
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirmationModal}
        onHide={handleCloseConfirmationModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Movie:</strong> {movie.movieName}
          </p>
          <p>
            <strong>Show Date:</strong>{" "}
            {selectedShow
              ? format(new Date(selectedShow.showDate), "MMMM dd, yyyy")
              : ""}
          </p>
          <p>
            <strong>Show Time:</strong>{" "}
            {selectedShow ? selectedShow.showTime : ""}
          </p>
          <p>
            <strong>Seats:</strong>{" "}
            {selectedSeats.map((seat) => seat.seatNo).join(", ")}
          </p>
          <p>
            <strong>Total Price:</strong> Rs.{" "}
            {selectedShow ? selectedShow.showPrice * selectedSeats.length : ""}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProceedToPayment}>
            Pay with Khalti
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BuyTickets;
