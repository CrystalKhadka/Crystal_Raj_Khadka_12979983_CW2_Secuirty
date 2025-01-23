import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleprofileApi, updateProfileApi } from '../../apis/Api';

const Profile = () => {
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    getSingleprofileApi()
      .then((res) => {
        console.log('API response:', res.data);
        const { username, phoneNumber, email, password } = res.data.user;
        setUsername(username);
        setPhoneNumber(phoneNumber);
        setEmail(email);
        setPassword(password);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = { username, phoneNumber, email };

    updateProfileApi(formData)
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred');
        }
      });
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container
      maxWidth='sm'
      sx={{ mt: 10, mb: 4 }}>
      <Card>
        <CardContent>
          <Typography
            variant='h5'
            component='h2'
            gutterBottom>
            Edit Profile
          </Typography>
          <Box
            component='form'
            onSubmit={handleUpdate}
            sx={{ mt: 2 }}>
            <TextField
              fullWidth
              id='username'
              label='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin='normal'
              variant='outlined'
            />
            <TextField
              fullWidth
              id='phoneNumber'
              label='Phone Number'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              margin='normal'
              variant='outlined'
            />
            <TextField
              fullWidth
              id='email'
              label='Email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin='normal'
              variant='outlined'
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='primary'
              sx={{ mt: 3, mb: 2 }}>
              Save Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
