import { PhotoCamera } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Container,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleProfileApi, updateProfileApi } from '../../apis/Api';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams();

  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    avatar: null,
    rememberDevice: false,
    bio: '',
    location: '',
    website: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSingleProfileApi()
      .then((res) => {
        const userData = res.data.user;
        setFormData((prev) => ({
          ...prev,
          ...userData,
        }));
        setUser(userData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfileApi(formData);
      if (response.status === 200) {
        toast.success('Profile updated successfully');
        if (formData.rememberDevice) {
          localStorage.setItem(
            'rememberedDevice',
            JSON.stringify({
              deviceId: navigator.userAgent,
              timestamp: new Date().getTime(),
            })
          );
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  if (loading) {
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
      maxWidth='md'
      sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            p: 3,
            textAlign: 'center',
          }}>
          <Avatar
            src={formData.avatar ? URL.createObjectURL(formData.avatar) : null}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          />
          <input
            accept='image/*'
            id='avatar-upload'
            type='file'
            hidden
            onChange={handleImageChange}
          />
          <label htmlFor='avatar-upload'>
            <IconButton
              component='span'
              sx={{ color: 'white' }}>
              <PhotoCamera />
            </IconButton>
          </label>
          <Typography
            variant='h4'
            component='h1'>
            {formData.username || 'Your Profile'}
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Box
            component='form'
            onSubmit={handleUpdate}>
            <Grid
              container
              spacing={3}>
              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  fullWidth
                  name='username'
                  label='Username'
                  value={formData.username}
                  onChange={handleChange}
                  variant='outlined'
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  fullWidth
                  name='phoneNumber'
                  label='Phone Number'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  variant='outlined'
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <TextField
                  fullWidth
                  name='email'
                  label='Email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  variant='outlined'
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  fullWidth
                  name='location'
                  label='Location'
                  value={formData.location}
                  onChange={handleChange}
                  variant='outlined'
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}>
                <TextField
                  fullWidth
                  name='website'
                  label='Website'
                  value={formData.website}
                  onChange={handleChange}
                  variant='outlined'
                />
              </Grid>
              <Grid
                item
                xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      name='rememberDevice'
                      checked={formData.rememberDevice}
                      onChange={handleChange}
                      color='primary'
                    />
                  }
                  label='Remember this device'
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                textAlign: 'center',
                gap: 4,
                justifyContent: 'center',
                display: 'flex',
              }}>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                size='large'
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}>
                Save Changes
              </Button>
              <Button
                type='button'
                variant='contained'
                color='secondary'
                size='large'
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}>
                Change Password
              </Button>
              <Button
                type='button'
                variant='contained'
                color='error'
                size='large'
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                }}>
                Delete
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default Profile;
