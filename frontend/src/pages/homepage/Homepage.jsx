import {
  Alert,
  Container,
  Grid,
  Paper,
  Skeleton,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMovieCount, getSingleProfileApi, pagination } from '../../apis/Api';
import MovieCard from '../../components/MovieCard';

const carouselImages = [
  {
    url: 'https://images.squarespace-cdn.com/content/v1/567064569cadb63cb308ddb1/1450208617048-6Z99SCNCDPDOLOVN6RO4/mad-max-fury-road-movie-posters.jpg',
    label: 'Mad Max',
  },
  {
    url: 'https://i.ebayimg.com/images/g/GtEAAOSw1W9eN1cY/s-l1600.jpg',
    label: 'Movie 2',
  },
  {
    url: 'https://thedullwoodexperiment.com/wp-content/uploads/2017/05/265-poster_umir-krvi.jpg',
    label: 'Movie 3',
  },
];

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showError, setShowError] = useState(false);
  const [user, setUser] = useState(null);
  const maxSteps = carouselImages.length;

  const limit = isMobile ? 2 : 3;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const countRes = await getMovieCount();

      if (!countRes?.data?.movieCount) {
        throw new Error('Invalid movie count response');
      }

      const count = countRes.data.movieCount;
      setTotalPages(Math.ceil(count / limit));

      const moviesRes = await pagination(page, limit);

      if (!Array.isArray(moviesRes?.data?.movies)) {
        throw new Error('Invalid movies response');
      }

      setMovies(moviesRes.data.movies);
    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage =
        err.response?.data?.message || 'An error occurred while fetching data';
      setError(errorMessage);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  useEffect(() => {
    getSingleProfileApi()
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        // console.log(error);
      });

    fetchData();
  }, [fetchData]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      // console.log('Searching for:', term);
    }, 500),
    []
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep === maxSteps - 1 ? 0 : prevStep + 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep === 0 ? maxSteps - 1 : prevStep - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [maxSteps]);

  const handleCloseError = () => {
    setShowError(false);
  };

  const MovieSkeletons = () => (
    <Grid
      container
      spacing={3}>
      {[...Array(limit)].map((_, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={index}>
          <Skeleton
            variant='rectangular'
            height={400}
          />
        </Grid>
      ))}
    </Grid>
  );

  if (error) {
    return (
      <Container sx={{ mt: 10, mb: 4 }}>
        <Alert
          severity='error'
          sx={{ mt: 5 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (user?.isAdmin) {
    return (
      <Navigate
        to='/admin/dashboard'
        replace={true}
      />
    );
  }

  return (
    <Container
      maxWidth='lg'
      sx={{ mt: 10, mb: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2 },
          mb: 4,
        }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component='h1'
          gutterBottom
          color='primary'
          sx={{ fontWeight: 'bold' }}>
          Welcome to CineEase
        </Typography>
      </Paper>

      <Typography
        variant='h4'
        component='h2'
        sx={{
          mb: 3,
          pl: 2,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          fontWeight: 'bold',
        }}>
        Now Showing
      </Typography>

      {loading ? (
        <MovieSkeletons />
      ) : (
        <Grid
          container
          spacing={3}
          sx={{ mb: 4 }}>
          {movies.map((movie) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={movie.id}>
              <MovieCard movieInformation={movie} />
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleCloseError}
          severity='error'
          sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Homepage;
