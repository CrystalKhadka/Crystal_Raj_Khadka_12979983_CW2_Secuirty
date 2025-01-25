import axios from 'axios';

// Function to extract token from cookies
const getTokenFromCookies = () => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='));
  return cookie ? cookie.split('=')[1] : null;
};

// Create an Axios instance
const Api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5000', // Use environment variable for base URL
  withCredentials: true, // Include cookies in requests
});

// Add request interceptor to dynamically add Authorization header
Api.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookies();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for global error handling
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

// API Endpoints
export const registerUserApi = (data) => Api.post('/api/user/create', data);
export const loginUserApi = (data) => Api.post('/api/user/login', data);
export const createMovieApi = (data) => Api.post('/api/movie/create', data);
export const getAllMoviesApi = () => Api.get('/api/movie/get_all_movies');
export const getSingleMovieApi = (id) =>
  Api.get(`/api/movie/get_single_movie/${id}`);
export const deleteMovieApi = (id) =>
  Api.delete(`/api/movie/delete_movie/${id}`);
export const updateMovieApi = (id, data) =>
  Api.put(`/api/movie/update_movie/${id}`, data);
export const pagination = (page, limit) =>
  Api.get(`/api/movie/pagination/?page=${page}&limit=${limit}`);
export const getMovieCount = () => Api.get('/api/movie/get_movies_count');
export const buyTicketsApi = (id, data) =>
  Api.post(`/api/movie/buy_tickets/${id}`, data);
export const addShowsApi = (data) => Api.post('/api/shows/create', data);
export const getAllShowsApi = () => Api.get('/api/shows/get_all');
export const getShowByMovieIdApi = (id) =>
  Api.get(`/api/shows/get_by_movie/${id}`);
export const getSeatsByShowIdApi = (id) =>
  Api.get(`/api/seat/get_seats_by_show/${id}`);
export const makeSeatUnavailableApi = (data) =>
  Api.put('/api/seat/setAvailable', data);
export const createBookingApi = (data) => Api.post('/api/booking/create', data);
export const getAllBookingsApi = () => Api.get('/api/booking/get_all_bookings');
export const getBookingsByUserApi = () =>
  Api.get('/api/booking/get_bookings_by_user');
export const forgotPasswordApi = (data) =>
  Api.post('/api/user/forgot-password', data);
export const resetPasswordApi = (data) =>
  Api.post('/api/user/reset-password', data);
export const getSingleProfileApi = () =>
  Api.get('/api/user/get_single_profile');
export const getAllProfilesApi = () => Api.get('/api/user/get_all_users');
export const deleteProfileApi = (id) =>
  Api.delete(`/api/user/delete_profile/${id}`);
export const updateProfileApi = (data) =>
  Api.put('/api/user/update_profile', data);
export const loginWithGoogleApi = (data) =>
  Api.post('/api/user/google_login', data);
export const getUserByGoogleEmailApi = (data) =>
  Api.post('/api/user/get_user_by_google_email', data);
export const initializeKhaltiApi = (data) =>
  Api.post('/api/payment/initialize_khalti', data);
export const contactUsApi = (data) => Api.post('/api/contact/create', data);
export const getContactMessagesApi = () => Api.get('/api/contact/get_contact');
export const getDashboardStatsApi = () => Api.get('/api/admin/dashboard_stats');
export const getAllLogsApi = (page, limit, searchTerm, filter) =>
  Api.get(
    `/api/admin/get_all_logs?page=${page}&limit=${limit}&searchTerm=${searchTerm}&filter=${filter}`
  );

// verify_register_otp
export const verifyRegisterOtpApi = (data) =>
  Api.put('/api/user/verify_register_otp', data);

// verify_login_otp
export const verifyLoginOtpApi = (data) =>
  Api.put('/api/user/verify_login_otp', data);
