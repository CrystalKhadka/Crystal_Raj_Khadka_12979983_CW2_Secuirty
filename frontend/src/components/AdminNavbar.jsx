// AdminNavbar.jsx
import {
  ConfirmationNumber,
  Dashboard,
  ExitToApp,
  Feedback,
  Movie,
  People,
  TheaterComedy,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const admin = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    {
      text: 'Movies Management',
      icon: <Movie />,
      path: '/admin/movieManagement',
    },
    {
      text: 'Shows Management',
      icon: <TheaterComedy />,
      path: '/admin/showManagement',
    },
    {
      text: 'Bookings Management',
      icon: <ConfirmationNumber />,
      path: '/admin/bookingsManagement',
    },
    {
      text: 'Customers Management',
      icon: <People />,
      path: '/admin/customerManagement',
    },
    {
      text: 'User Feedbacks',
      icon: <Feedback />,
      path: '/admin/userFeedbacks',
    },
  ];

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: 'background.default',
        },
      }}>
      <Box sx={{ p: 2 }}>
        <Typography
          variant='h6'
          sx={{ fontWeight: 'bold' }}>
          Admin Panel
        </Typography>
        <Typography
          variant='subtitle2'
          color='text.secondary'>
          Welcome, {admin?.username}
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}>
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? 'white' : 'inherit',
              }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <ListItem
          button
          onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default AdminNavbar;
