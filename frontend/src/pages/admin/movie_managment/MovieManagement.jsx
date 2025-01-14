import React, { useEffect, useState } from "react";
import {
  addShowsApi,
  createMovieApi,
  deleteMovieApi,
  getAllMoviesApi,
} from "../../../apis/Api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MovieTicketingAdminPanel.css";
const MovieManagement = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getAllMoviesApi()
      .then((res) => {
        setMovies(res.data.movies);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const [movieName, setMovieName] = useState("");
  const [movieGenre, setMovieGenre] = useState("");
  const [movieDetails, setMovieDetails] = useState("");
  const [movieRated, setMovieRated] = useState("");
  const [movieDuration, setMovieDuration] = useState("");
  const [moviePosterImage, setMoviePosterImage] = useState(null);
  const [previewPosterImage, setPreviewPosterImage] = useState(null);
  const [movieForShow, setMovieForShow] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPrice, setShowPrice] = useState(0);
  const [showTime, setShowTime] = useState("");
  const [showDate, setShowDate] = useState("");

  const handlePosterImage = (event) => {
    const file = event.target.files[0];
    setMoviePosterImage(file);
    setPreviewPosterImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(moviePosterImage);

    const formData = new FormData();
    formData.append("movieName", movieName);
    formData.append("movieGenre", movieGenre);
    formData.append("movieDetails", movieDetails);
    formData.append("movieRated", movieRated);
    formData.append("movieDuration", movieDuration);
    formData.append("moviePosterImage", moviePosterImage);

    createMovieApi(formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);

          window.location.reload();
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.warning(error.response.data.message);
          } else if (error.response.status === 500) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!!");
          }
        } else {
          toast.error("Something went wrong!");
        }
      });
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm("Are you sure you want to delete?");
    if (confirmDialog) {
      deleteMovieApi(id)
        .then((res) => {
          if (res.status === 201) {
            toast.success(res.data.message);
            setMovies(movies.filter((movie) => movie._id !== id));
          }
        })
        .catch((error) => {
          if (error.response.status === 500) {
            toast.error(error.response.data.message);
          }
        });
    }
  };

  const handleShow = (movie) => {
    setMovieForShow(movie);
    setShowModal(true);
  };

  const handleAddShow = (e) => {
    e.preventDefault();

    const data = {
      showDate,
      showTime,
      price: showPrice,
      movieId: movieForShow._id,
    };

    console.log(data);

    addShowsApi(data)
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload();
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

  return (
    <>
      <div className="container mt-5 py-5">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold">Movie Ticketing Admin Panel</h3>
          <button
            type="button"
            className="btn btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#addMovieModal"
          >
            Add Movie
          </button>
        </div>

        <div
          className="modal fade"
          id="addMovieModal"
          tabIndex="-1"
          aria-labelledby="addMovieModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addMovieModalLabel">
                  Create a New Movie
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Movie Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={movieName}
                      onChange={(e) => setMovieName(e.target.value)}
                      placeholder="Enter Movie Name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Movie Genre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={movieGenre}
                      onChange={(e) => setMovieGenre(e.target.value)}
                      placeholder="Enter Movie Genre"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Movie Details</label>
                    <textarea
                      className="form-control"
                      value={movieDetails}
                      onChange={(e) => setMovieDetails(e.target.value)}
                      rows="3"
                      placeholder="Enter Movie Details"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Movie Rated</label>
                    <select
                      value={movieRated}
                      onChange={(e) => setMovieRated(e.target.value)}
                      className="form-control"
                    >
                      <option value="info">Select Movie Rating</option>
                      <option value="G">G</option>
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                      <option value="NR">NR</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Movie Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      value={movieDuration}
                      onChange={(e) => setMovieDuration(e.target.value)}
                      placeholder="Enter Movie Duration"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Upload Movie Poster</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handlePosterImage}
                      required
                    />
                    {previewPosterImage && (
                      <img
                        src={previewPosterImage}
                        alt="preview poster"
                        className="img-fluid rounded mt-3"
                      />
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            aria-labelledby="addShowModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addShowModalLabel">
                    Add Show Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddShow}>
                    <div className="mb-3">
                      <label className="form-label">Show Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={showDate}
                        onChange={(e) => setShowDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Show Time</label>
                      <input
                        type="time"
                        className="form-control"
                        value={showTime}
                        onChange={(e) => setShowTime(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Show Price</label>
                      <input
                        type="number"
                        className="form-control"
                        value={showPrice}
                        onChange={(e) => setShowPrice(e.target.value)}
                        placeholder="Enter Show Price"
                        required
                      />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className="table table-striped mt-4">
          <thead className="table-dark">
            <tr>
              <th>Movie Poster</th>
              <th>Movie Name</th>
              <th>Movie Genre</th>
              <th>Movie Details</th>
              <th>Movie Rated</th>
              <th>Movie Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((singleMovie) => (
              <tr key={singleMovie._id}>
                <td>
                  <img
                    width="40px"
                    height="40px"
                    src={`http://localhost:5000/movies/${singleMovie.moviePosterImage}`}
                    alt={singleMovie.movieName}
                    className="img-thumbnail"
                  />
                </td>
                <td>{singleMovie.movieName}</td>
                <td>{singleMovie.movieGenre}</td>
                <td>{singleMovie.movieDetails}</td>
                <td>{singleMovie.movieRated}</td>
                <td>{singleMovie.movieDuration}</td>
                <td>
                  <Link
                    to={`/admin/update/${singleMovie._id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(singleMovie._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleShow(singleMovie)}
                    className="btn btn-danger btn-sm"
                  >
                    Add Show
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MovieManagement;
