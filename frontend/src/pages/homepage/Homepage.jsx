import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MobileStepper,
  Pagination,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { getMovieCount, pagination } from '../../apis/Api';
import MovieCard from '../../components/MovieCard';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

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
  const maxSteps = carouselImages.length;

  const limit = isMobile ? 2 : 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const countRes = await getMovieCount();
        const count = countRes.data.movieCount;
        setTotalPages(Math.ceil(count / limit));

        const moviesRes = await pagination(page, limit);
        setMovies(moviesRes.data.movies);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [limit, page]);

  const handlePaginationChange = async (event, value) => {
    setPage(value);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  if (error) {
    return (
      <Container>
        <Paper
          elevation={3}
          sx={{ p: 3, mt: 5, textAlign: 'center' }}>
          <Typography color='error'>{error}</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container
      maxWidth='lg'
      sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          textAlign: 'center',
          background: theme.palette.grey[50],
        }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          component='h1'
          gutterBottom
          color='primary'>
          Welcome to Cold Films
        </Typography>
        <Typography
          variant='h6'
          color='text.secondary'
          paragraph>
          Your ultimate destination for booking movie tickets online.
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'>
          Check out the latest movies and book your tickets now
        </Typography>
      </Paper>

      <Box sx={{ maxWidth: '100%', flexGrow: 1, mb: 4 }}>
        <Paper
          elevation={4}
          sx={{ position: 'relative' }}>
          <AutoPlaySwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents>
            {carouselImages.map((step, index) => (
              <div key={index}>
                {Math.abs(activeStep - index) <= 2 ? (
                  <Box
                    component='img'
                    sx={{
                      height: { xs: 200, sm: 300, md: 400 },
                      display: 'block',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                    src={step.url}
                    alt={step.label}
                  />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            steps={maxSteps}
            position='static'
            activeStep={activeStep}
            nextButton={
              <Button
                size='small'
                onClick={handleNext}
                disabled={activeStep === maxSteps - 1}>
                Next
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button
                size='small'
                onClick={handleBack}
                disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                Back
              </Button>
            }
          />
        </Paper>
      </Box>

      <Typography
        variant='h4'
        component='h2'
        sx={{
          mb: 3,
          pl: 1,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
        }}>
        Now Showing
      </Typography>

      {loading ? (
        <Box
          display='flex'
          justifyContent='center'
          my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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

          <Box
            display='flex'
            justifyContent='center'
            sx={{
              mt: 4,
              mb: 2,
              '& .MuiPagination-ul': {
                justifyContent: 'center',
              },
            }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePaginationChange}
              color='primary'
              size={isMobile ? 'small' : 'medium'}
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default Homepage;
