import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleMovieApi, updateMovieApi } from '../../../apis/Api';

const UpdateMovie = () => {
  // get id from url
  const { id } = useParams();

  // get movie information (Backend)
  useEffect(() => {
    getSingleMovieApi(id)
      .then((res) => {
        console.log(res.data);

        //res -> data(message, success, movie(pn,pp,pc) )
        //res.data.movie.productName
        setMovieName(res.data.movie.movieName);
        setMovieGenre(res.data.movie.movieGenre);
        setMovieRated(res.data.movie.movieRated);
        setMovieDetails(res.data.movie.movieDetails);
        setMovieDuration(res.data.movie.movieDuration);
        setOldImage(res.data.movie.moviePosterImage);
      })
      .catch((error) => {
        console.log(error);
      });
  }, {});

  // fill all the info in each fields

  // make a use state
  const [movieName, setMovieName] = useState('');
  const [movieGenre, setMovieGenre] = useState('');
  const [movieRated, setMovieRated] = useState('');
  const [movieDetails, setMovieDetails] = useState('');
  const [movieDuration, setMovieDuration] = useState('');

  // state for image
  const [moviePosterNewImage, setmoviePosterNewImage] = useState(null);
  const [previewMoviePosterNewImage, setPreviewMoviePosterNewImage] =
    useState(null);
  const [oldImage, setOldImage] = useState('');

  // image upload handler
  const handleImage = (event) => {
    const file = event.target.files[0];
    setmoviePosterNewImage(file); // for backend
    setPreviewMoviePosterNewImage(URL.createObjectURL(file));
  };

  // update movie
  const handleUpdate = (e) => {
    e.preventDefault();

    // make a form data (text, files)
    const formData = new FormData();
    formData.append('movieName', movieName);
    formData.append('movieGenre', movieGenre);
    formData.append('movieRated', movieRated);
    formData.append('movieDetails', movieDetails);
    formData.append('movieDuration', movieDuration);

    if (moviePosterNewImage) {
      formData.append('moviePosterImage', moviePosterNewImage);
    }

    // call update movie API
    updateMovieApi(id, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message);
        }
      });
  };

  return (
    <>
      <div className='container mt-3'>
        <h2>
          Update Movie For <span className='text-danger'>{movieName}</span>
        </h2>

        <div className='d-flex gap-3'>
          <form action=''>
            <label htmlFor=''>Movie Name</label>
            <input
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              className='form-control'
              type='text'
              placeholder='Enter your movie name'
            />

            <label
              className='mt-2'
              htmlFor=''>
              Movie Genre
            </label>
            <input
              value={movieGenre}
              onChange={(e) => setMovieGenre(e.target.value)}
              className='form-control'
              type='text'
              placeholder='Enter your movie genre'
            />

            <label className='mt-2'>Enter Details</label>
            <textarea
              value={movieDetails}
              onChange={(e) => setMovieDetails(e.target.value)}
              className='form-control'></textarea>

            <label className='mt-2'>Movie Rated</label>
            <select
              value={movieRated}
              onChange={(e) => setMovieRated(e.target.value)}
              className='form-control'>
              <option value='info'>Select Movie Rating</option>
              <option value='G'>G</option>
              <option value='PG'>PG</option>
              <option value='PG-13'>PG-13</option>
              <option value='R'>R</option>
              <option value='NR'>NR</option>
            </select>

            <label
              className='mt-2'
              htmlFor=''>
              Movie Duration
            </label>
            <input
              value={movieDuration}
              onChange={(e) => setMovieDuration(e.target.value)}
              className='form-control'
              type='text'
              placeholder='Enter movie duration'
            />

            <label className='mt-2'>Choose Movie Poster Image</label>
            <input
              onChange={handleImage}
              type='file'
              className='form-control'
            />

            <button
              onClick={handleUpdate}
              className='btn btn-danger w-100 mt-2'>
              Update Movie
            </button>
          </form>
          <div className='image section'>
            <h6>Previewing old image</h6>
            <img
              height={'200px'}
              width={'300px'}
              className='image-fluid rounded-4 object-fit-cover'
              src={`https://localhost:5000/movies/${oldImage}`}
            />

            {previewMoviePosterNewImage && (
              <>
                <h6>New Image</h6>
                <img
                  height={'200px'}
                  width={'200px'}
                  className='image-fluid rounded-4 object-fit-cover'
                  src={previewMoviePosterNewImage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateMovie;
