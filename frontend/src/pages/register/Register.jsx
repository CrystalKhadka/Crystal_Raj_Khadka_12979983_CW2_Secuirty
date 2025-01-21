import {
  Email,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Fade,
  Grow,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import zxcvbn from 'zxcvbn'; // Import zxcvbn for password strength evaluation
import { registerUserApi } from '../../apis/Api'; // Replace with your actual API endpoint

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

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handle form input changes
  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });

    if (field === 'password') {
      const strength = zxcvbn(value);
      setPasswordStrength({
        score: strength.score,
        feedback: strength.feedback.suggestions.join(' ') || 'Strong password!',
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => () => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  // Validate form inputs
  const validate = () => {
    let isValid = true;
    const newErrors = { ...errors };

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

    if (passwordStrength.score < 2) {
      newErrors.password =
        'Password is too weak. Please choose a stronger password.';
      isValid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
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
      const res = await registerUserApi(data); // Call API to register user
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

  // Shared TextField properties for consistent styling
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

  // Map password strength score to color
  const getStrengthColor = (score) => {
    switch (score) {
      case 0:
        return theme.palette.error.main;
      case 1:
        return theme.palette.warning.main;
      case 2:
        return theme.palette.info.main;
      case 3:
        return theme.palette.success.light;
      case 4:
        return theme.palette.success.main;
      default:
        return theme.palette.grey[400];
    }
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
              <Typography
                variant='h4'
                align='center'
                sx={{
                  mb: 3,
                  fontWeight: 'bold',
                }}>
                Create an Account
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
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
                            edge='end'>
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

                  {/* Password Strength Bar */}
                  {formData.password && (
                    <Box>
                      <LinearProgress
                        variant='determinate'
                        value={(passwordStrength.score + 1) * 20}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          backgroundColor: theme.palette.grey[300],
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStrengthColor(
                              passwordStrength.score
                            ),
                          },
                        }}
                      />
                      <Typography
                        variant='body2'
                        sx={{
                          mt: 1,
                          color: getStrengthColor(passwordStrength.score),
                        }}>
                        {passwordStrength.feedback}
                      </Typography>
                    </Box>
                  )}

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
                            edge='end'>
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
                </Stack>

                <Button
                  type='submit'
                  variant='contained'
                  sx={{ mt: 3 }}
                  disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Register'}
                </Button>

                <Box
                  sx={{
                    textAlign: 'center',
                    mt: 2,
                  }}>
                  <Typography variant='body2'>
                    Already have an account?{' '}
                    <Link
                      to='/login'
                      style={{ color: theme.palette.primary.main }}>
                      Login here
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Box>
          </Fade>
        </Paper>
      </Grow>
    </Container>
  );
};

export default Register;
