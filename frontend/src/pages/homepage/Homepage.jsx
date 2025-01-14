import React, { useEffect, useState } from "react";
import { pagination, getMovieCount } from "../../apis/Api";
import MovieCard from "../../components/MovieCard";
import "./Homepage.css";

const Homepage = () => {
  // 1. State for all fetched products
  const [movies, setMovies] = useState([]); //array
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [limit, setLimit] = useState(3);

  // 2. Call API initially (page load) - set all fetch products to state(1)
  useEffect(() => {
    getMovieCount()
      .then((res) => {
        const count = res.data.movieCount;
        setTotalPages(Math.ceil(count / limit));
        console.log(totalPages);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });

    pagination(page, limit)
      .then((res) => {
        setMovies(res.data.movies);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }, []);

  const handlePagination = (id) => {
    setPage(id);
    pagination(id, limit)
      .then((res) => {
        setMovies(res.data.movies);
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };

  return (
    <>
      <div className="container mt-5 p-5">
        <div className="jumbotron text-center bg-light">
          <h1 className="display-4">Welcome to Cold Films</h1>
          <p className="lead">
            Your ultimate destination for booking movie tickets online.
          </p>
          <hr className="my-4" />
          <p>Check out the latest movies and book your tickets now</p>
        </div>
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-pause="hover"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://images.squarespace-cdn.com/content/v1/567064569cadb63cb308ddb1/1450208617048-6Z99SCNCDPDOLOVN6RO4/mad-max-fury-road-movie-posters.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://i.ebayimg.com/images/g/GtEAAOSw1W9eN1cY/s-l1600.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="https://thedullwoodexperiment.com/wp-content/uploads/2017/05/265-poster_umir-krvi.jpg"
                className="d-block w-100"
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <h2>Now Showing</h2>
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movieInformation={movie} />
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => handlePagination(1)} disabled={page === 1}>
            First
          </button>
          <button
            onClick={() => handlePagination(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePagination(i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePagination(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
          <button
            onClick={() => handlePagination(totalPages)}
            disabled={page === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </>
  );
};
export default Homepage;
