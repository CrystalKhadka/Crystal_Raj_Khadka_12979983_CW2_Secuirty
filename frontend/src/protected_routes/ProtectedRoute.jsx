import {
  Alert,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import Navbar from '../components/Navbar';

const LoadingView = () => (
  <Container>
    <Stack
      spacing={2}
      alignItems='center'
      justifyContent='center'
      sx={{ minHeight: '100vh' }}>
      <CircularProgress size={40} />
      <Typography
        variant='h6'
        color='text.secondary'>
        Checking authentication...
      </Typography>
    </Stack>
  </Container>
);

const ErrorView = ({ message, link, linkText }) => (
  <Container>
    <Stack
      alignItems='center'
      justifyContent='center'
      sx={{ minHeight: '100vh' }}>
      <Paper
        elevation={3}
        sx={{ p: 3, width: '100%', maxWidth: 400 }}>
        <Alert
          severity='error'
          sx={{ mb: 2 }}>
          {message}
        </Alert>
        <Stack alignItems='center'>
          <Typography
            component='a'
            href={link}
            sx={{ textDecoration: 'none', color: 'primary.main' }}>
            {linkText}
          </Typography>
        </Stack>
      </Paper>
    </Stack>
  </Container>
);

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
      } catch (error) {
        setError('Authentication failed. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <LoadingView />;

  if (error) {
    return (
      <ErrorView
        message={error}
        link='/login'
        linkText='Return to Login'
      />
    );
  }

  if (!user) {
    return (
      <Navigate
        to='/login'
        state={{ from: location }}
        replace
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.isAdmin ? 'admin' : 'user')
  ) {
    return (
      <ErrorView
        message="You don't have permission to access this page."
        link='/'
        linkText='Return to Home'
      />
    );
  }

  return (
    <Stack
      direction='row'
      sx={{ minHeight: '100vh' }}>
      {user?.isAdmin ? <AdminNavbar /> : <Navbar />}
      <Stack
        component='main'
        sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        {children}
      </Stack>
    </Stack>
  );
};

export default ProtectedRoute;
