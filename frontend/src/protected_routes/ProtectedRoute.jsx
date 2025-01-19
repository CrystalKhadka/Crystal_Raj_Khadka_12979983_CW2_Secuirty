// ProtectedRoute.jsx
import { Box, CircularProgress } from '@mui/material';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'>
        <CircularProgress />
      </Box>
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
      <Navigate
        to='/unauthorized'
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
