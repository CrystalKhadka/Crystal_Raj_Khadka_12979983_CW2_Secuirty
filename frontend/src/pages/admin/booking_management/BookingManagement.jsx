import React, { useEffect, useState } from "react";
import { getAllBookingsApi } from "../../../apis/Api";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllBookingsApi()
      .then((res) => {
        if (res.data && res.data.bookings) {
          setBookings(res.data.bookings);
        } else {
          setBookings([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch bookings. Please try again later.");
        setLoading(false);
      });
  }, []);

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.show?.movieId?.movieName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid bg-light min-vh-100 py-5">
      <div className="container">
        <h1 className="text-center mb-4">Booking Management</h1>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search by user or movie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="alert alert-info">No Bookings Available</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Movie Name</th>
                      <th>Seats</th>
                      <th>Show Date</th>
                      <th>Show Time</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.user?.username || "N/A"}</td>
                        <td>{booking.show?.movieId?.movieName || "N/A"}</td>
                        <td>
                          {booking.seats
                            ?.map((seat) => seat.seatNo)
                            .join(", ") || "N/A"}
                        </td>
                        <td>{booking.show?.showDate || "N/A"}</td>
                        <td>{booking.show?.showTime || "N/A"}</td>
                        <td>Rs.{booking.price}</td>
                        {/* <td>
                          <Link
                            to={`/admin/bookings/edit/${booking._id}`}
                            className='btn btn-outline-primary btn-sm me-2'
                          >
                            <i className='bi bi-pencil me-1'></i>Edit
                          </Link>
                          <button className='btn btn-outline-danger btn-sm'>
                            <i className='bi bi-trash me-1'></i>Delete
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;
