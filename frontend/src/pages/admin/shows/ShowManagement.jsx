import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllShowsApi } from '../../../apis/Api';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ShowManagement = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = () => {
    setLoading(true);
    getAllShowsApi()
      .then((res) => {
        setShows(res.data.shows || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to fetch shows. Please try again later.");
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    toast.warning("Delete functionality not implemented");
  };

  const filteredShows = shows.filter(show => 
    show.movieId.movieName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    show.showDate.includes(searchTerm) ||
    show.showTime.includes(searchTerm)
  );

  return (
    <div className='container-fluid bg-light min-vh-100 py-5'>
      <div className='container'>
        <h1 className='text-center mb-4'>Show Management</h1>
        <div className='card shadow-sm'>
          <div className='card-body'>
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <input
                type='text'
                className='form-control w-50'
                placeholder='Search by movie name, date, or time...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
            </div>
            {loading ? (
              <div className='text-center'>
                <div className='spinner-border text-primary' role='status'>
                  <span className='visually-hidden'>Loading...</span>
                </div>
              </div>
            ) : filteredShows.length === 0 ? (
              <div className='alert alert-info'>No Shows Available</div>
            ) : (
              <div className='table-responsive'>
                <table className='table table-hover'>
                  <thead className='table-light'>
                    <tr>
                      <th>Movie Poster</th>
                      <th>Movie Name</th>
                      <th>Duration</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShows.map((show) => (
                      <tr key={show._id}>
                        <td>
                          <img
                            width="50px"
                            height="75px"
                            src={`http://localhost:5000/movies/${show.movieId.moviePosterImage}`}
                            alt={show.movieId.movieName}
                            className="img-thumbnail"
                          />
                        </td>
                        <td>{show.movieId.movieName}</td>
                        <td>{show.movieId.movieDuration}</td>
                        <td>{show.showDate}</td>
                        <td>{show.showTime}</td>
                        <td>Rs.{show.showPrice}</td>
                        <td>
                          <Link to={`/admin/shows/edit/${show._id}`} className='btn btn-outline-primary btn-sm me-2'>
                            <i className='bi bi-pencil me-1'></i>Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(show._id)} 
                            className='btn btn-outline-danger btn-sm'
                          >
                            <i className='bi bi-trash me-1'></i>Delete
                          </button>
                        </td>
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

export default ShowManagement;