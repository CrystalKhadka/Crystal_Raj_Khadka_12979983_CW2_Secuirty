import axios from 'axios';

// Creating backend config
const Api = axios.create({
  baseURL: 'https://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
};

const jsonConfig = {
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
};

// Register API
export const registerUserApi = (data) => Api.post('/api/user/create', data);

// Login API
export const loginUserApi = (data) => Api.post('/api/user/login', data);

// Create Movie API
export const createMovieApi = (data) => Api.post('/api/movie/create', data);

// Fetch all Movies API
export const getAllMoviesApi = () =>
  Api.get('/api/movie/get_all_movies', config);

// Fetch single Movie by ID API
export const getSingleMovieApi = (id) =>
  Api.get(`/api/movie/get_single_movie/${id}`, config);

// Delete Movie by ID API
export const deleteMovieApi = (id) =>
  Api.delete(`/api/movie/delete_movie/${id}`, config);

// Update Movie by ID API
export const updateMovieApi = (id, data) =>
  Api.put(`/api/movie/update_movie/${id}`, data, config);

// Pagination
export const pagination = (page, limit) =>
  Api.get(`/api/movie/pagination/?page=${page}&limit=${limit}`, config);

export const getMovieCount = () =>
  Api.get('/api/movie/get_movies_count', config);

// Forgot password API
export const forgotPasswordApi = (data) =>
  Api.post('/api/user/forgot-password', data);

// Reset password API
export const resetPasswordApi = (data) =>
  Api.post('/api/user/reset-password', data);

// Fetch single profile by ID API
export const getSingleprofileApi = () =>
  Api.get(`/api/user/get_single_profile`, config);

// Fetch all profiles
export const getAllProfileApi = () =>
  Api.get('/api/user/get_all_users', config);

// Delete profile by ID API
export const deleteProfileApi = (id) =>
  Api.delete(`/api/user/delete_profile/${id}`, config);

// Update profile by ID API
export const updateProfileApi = (user) =>
  Api.put(`/api/user/update_profile`, user, config);

// Buy tickets (in movie details page contaning shows)
export const buyTicketsApi = (id, data) =>
  Api.post(`/api/movie/buy_tickets/${id}`, data, config);

// Add show api
export const addShowsApi = (data) =>
  Api.post('/api/shows/create', data, config);

// Get All Shows
export const getAllShowsApi = () => Api.get('/api/shows/get_all', config);

// Get show by ID
export const getShowByMovieIdApi = (id) =>
  Api.get(`/api/shows//get_by_movie/${id}`, config);

// Get seats by shoe
export const getSeatsByShowIdApi = (id) =>
  Api.get(`/api/seat/get_seats_by_show/${id}`, config);

// Book tickets
export const bookTicketsApi = (data) =>
  Api.post('/api/booking/create', data, jsonConfig);

// get a ll bookings api
export const getAllBookingsApi = (data) =>
  Api.get('api/booking/get_all_bookings', data, config);

export const getBookingsByUserApi = () =>
  Api.get('api/booking/get_bookings_by_user', config);
// Make seat unavailable
export const makeSeatUnavailableApi = (data) =>
  Api.put('/api/seat/setAvailable', data, jsonConfig);

// dashboard stats
export const getDashboardStats = () =>
  Api.get('/api/admin/dashboard_stats', config);

// get ticket detail api

// login with google
export const loginWithGoogle = (data) =>
  Api.post('/api/user/google_login', data, config);

//get user by google email
export const getUserByGoogleEmail = (data) =>
  Api.post('/api/user/get_user_by_google_email', data, config);

// khalti
export const initializeKhalti = (data) =>
  Api.post('/api/payment/initialize_khalti', data, config);

// contact us API
export const contactUs = (data) =>
  Api.post('/api/contact/create', data, config);

// get contact us message API
export const getContactUs = () => Api.get('/api/contact/get_contact', config);
