import React, { useEffect, useState } from "react";
import { getBookingsByUserApi } from "../../apis/Api";
import { QRCodeSVG } from "qrcode.react";
import "./Tickets.css";

const Card = ({ children, className }) => (
  <div className={`card ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

const CardContent = ({ children, className }) => (
  <div className={`card-content ${className}`}>{children}</div>
);

const Tickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getBookingsByUserApi()
      .then((res) => {
        const sortedTickets = res.data.tickets.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTickets(sortedTickets);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const groupTicketsByDate = (tickets) => {
    const groups = {};
    tickets.forEach((ticket) => {
      const date = new Date(ticket.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(ticket);
    });
    return groups;
  };

  const groupedTickets = groupTicketsByDate(tickets);

  return (
    <>
    <div className="tickets-container my-5">
      <h2 className="tickets-title">My Tickets</h2>
      {tickets.length === 0 ? (
        <p className="no-tickets">No tickets available</p>
      ) : (
        Object.entries(groupedTickets).map(([date, dateTickets]) => (
          <div key={date} className="date-group">
            <h3 className="date-header">{date}</h3>
            <div className="tickets-grid">
              {dateTickets.map((ticket, index) => {
                const { show, seats, user, price } = ticket;
                const { movieId, showDate, showTime } = show;
                const { movieName } = movieId;

                return (
                  <div key={ticket._id} className="ticket-item">
                    <div className="ticket-number">{index + 1}</div>
                    <Card>
                      <CardHeader>
                        <div>
                          <h3 className="movie-title">{movieName}</h3>
                          <p className="show-time">
                            {new Date(showDate).toLocaleDateString()} at{" "}
                            {showTime}
                          </p>
                        </div>
                        <QRCodeSVG
                          value={`Ticket ID: ${ticket._id}`}
                          size={64}
                        />
                      </CardHeader>
                      <CardContent>
                        <div className="ticket-details">
                          <div>
                            <h4>Seats</h4>
                            {seats.length > 0 ? (
                              <ul className="seat-list">
                                {seats.map((seat) => (
                                  <li key={seat._id}>
                                    Seat Number: {seat.seatNo}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No seats selected</p>
                            )}
                          </div>
                          <div>
                            <h4>User Information</h4>
                            <p>Username: {user.username}</p>
                            <p>Email: {user.email}</p>
                            <p>Phone: {user.phoneNumber}</p>
                          </div>
                        </div>
                        <div className="ticket-price">
                          <p>Price: Rs.{price}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      </div>
    </>
  );
};

export default Tickets;
