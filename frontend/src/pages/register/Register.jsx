import {
  Email,
  LocalMovies,
  Lock,
  Person,
  Phone,
  Theaters,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Divider,
  Fade,
  Grow,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerUserApi } from '../../apis/Api';

const Register = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    setErrors({ ...errors, [field]: '' });
  };

  const togglePasswordVisibility = (field) => () => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Enhanced validation rules
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters long';
      isValid = false;
    }

    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters with letters and numbers';
      isValid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    const data = {
      username: formData.username,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await registerUserApi(data);
      toast.success(res.data.message);
    } catch (err) {
      if (err.response) {
        toast.warning(err.response.data.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const textFieldProps = {
    fullWidth: true,
    variant: 'outlined',
    margin: 'normal',
    size: 'medium',
    sx: {
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused fieldset': {
          borderWidth: '2px',
        },
      },
      '& .MuiInputLabel-root': {
        '&.Mui-focused': {
          color: theme.palette.primary.main,
        },
      },
    },
  };

  return (
    <Container
      maxWidth='sm'
      sx={{ mt: 10, mb: 8 }}>
      <Grow
        in
        timeout={800}>
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme.palette.divider}`,
          }}>
          <Fade
            in
            timeout={1200}>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  mb: 3,
                  transform: 'scale(1.2)',
                }}>
                <LocalMovies
                  sx={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  }}
                />
                <Theaters
                  sx={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  }}
                />
              </Box>

              <Typography
                variant='h4'
                component='h1'
                align='center'
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  mb: 1,
                }}>
                Create an account
              </Typography>

              <Typography
                variant='body1'
                align='center'
                color='text.secondary'
                sx={{ mb: 4, maxWidth: '80%', mx: 'auto' }}>
                Your ticket to cinematic adventures awaits
              </Typography>

              <Divider sx={{ mb: 4 }} />

              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  {/* Form fields remain the same but with enhanced textFieldProps */}
                  <TextField
                    {...textFieldProps}
                    label='Username'
                    error={!!errors.username}
                    helperText={errors.username}
                    value={formData.username}
                    onChange={handleChange('username')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Person
                            color={errors.username ? 'error' : 'primary'}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    {...textFieldProps}
                    label='Phone Number'
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    value={formData.phoneNumber}
                    onChange={handleChange('phoneNumber')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Phone
                            color={errors.phoneNumber ? 'error' : 'primary'}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    {...textFieldProps}
                    label='Email'
                    type='email'
                    error={!!errors.email}
                    helperText={errors.email}
                    value={formData.email}
                    onChange={handleChange('email')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Email color={errors.email ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    {...textFieldProps}
                    label='Password'
                    type={showPassword.password ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors.password}
                    value={formData.password}
                    onChange={handleChange('password')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Lock color={errors.password ? 'error' : 'primary'} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={togglePasswordVisibility('password')}
                            edge='end'
                            size='large'>
                            {showPassword.password ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    {...textFieldProps}
                    label='Confirm Password'
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Lock
                            color={errors.confirmPassword ? 'error' : 'primary'}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={togglePasswordVisibility(
                              'confirmPassword'
                            )}
                            edge='end'
                            size='large'>
                            {showPassword.confirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    fullWidth
                    disabled={isLoading}
                    sx={{
                      mt: 4,
                      mb: 2,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}>
                    {isLoading ? 'Creating Account...' : 'Register'}
                  </Button>

                  <Box
                    sx={{
                      textAlign: 'center',
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                    }}>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      component='span'>
                      Already have a ticket?{' '}
                    </Typography>
                    <Link
                      to='/login'
                      style={{
                        textDecoration: 'none',
                      }}>
                      <Typography
                        variant='body2'
                        component='span'
                        color='primary'
                        sx={{
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}>
                        Login Now
                      </Typography>
                    </Link>
                  </Box>
                </Stack>
              </form>
            </Box>
          </Fade>
        </Paper>
      </Grow>
    </Container>
  );
};

export default Register;
