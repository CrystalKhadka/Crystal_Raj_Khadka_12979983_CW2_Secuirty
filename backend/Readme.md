# Movie Ticketing Purchasing System - Backend

## Overview

The backend for the Movie Ticketing Purchasing System is built with Node.js and
handles functionalities for both admin and client sides. It manages movie data,
authentication, and various API endpoints for authentication, movie purchasing,
payment processing, admin tasks, and shows.

## Features

### User APIs

- **POST** `api/user/create` - User registration
- **POST** `api/user/login` - User login to obtain a JWT token
- **POST** `api/user/forgot-password` - Forgot password
- **POST** `api/user/google_login` - Login with Google
- **POST** `api/user/get_user_by_google_email` - Retrieve user via Google email
- **GET** `api/user/get_all_users` - Retrieve all users
- **GET** `api/user/get_single_profile` - Retrieve a single user profile
- **PUT** `api/user/update_profile` - Update user profile

### Movie APIs

- **POST** `api/movie/create` - Create a new movie (admin only)
- **GET** `api/movie/get_all_movies` - Retrieve all movies
- **GET** `api/movie/get_single_movie/:id` - Retrieve a single movie by ID
- **GET** `api/movie/pagination` - Fetch movies with pagination
- **GET** `api/movie/get_movies_count` - Retrieve the total movie count
- **PUT** `api/movie/update_movie/:id` - Update movie details by ID

### Show APIs

- **POST** `api/shows/create` - Create a show for a movie
- **GET** `api/shows/get_all` - Retrieve all shows
- **GET** `api/shows/get_by_movie` - Retrieve shows by movie ID
- **GET** `api/shows/get_by_id` - Retrieve a show by ID
- **PUT** `api/shows/:id/update` - Update show details by ID

### Seat APIs

- **POST** `api/seat/create` - Add a seat to a show
- **GET** `api/seat/get_seats_by_show/:id` - Retrieve seats by show ID
- **PUT** `api/seat/setAvailable` - Update seat availability status

### Booking APIs

- **POST** `api/booking/create` - Purchase movie tickets
- **GET** `api/booking/get_booking` - Retrieve a booking
- **GET** `api/booking/get_all_bookings` - Retrieve all bookings
- **GET** `api/booking/get_bookings_by_user` - Retrieve bookings by user
- **GET** `api/booking/get_by_id` - Retrieve booking by booking ID
- **PUT** `api/booking/change_status/:id` - Update booking status by ID

### Contact Us APIs

- **POST** `api/contact/create` - Send a message
- **GET** `api/contact/get_contact` - Retrieve messages

### Khalti APIs

- **POST** `api/payment/initialize_khalti` - Initialize Khalti payment
- **GET** `api/payment/complete-khalti-payment` - Complete Khalti payment

## Technologies

- **Node.js** - Server-side runtime environment
- **Express.js** - Backend framework for building web applications
- **MongoDB** - NoSQL database for storing and managing data
- **Mongoose** - Object Data Modeling library for MongoDB and Node.js
- **Nodemon** - Tool for automatically restarting the server during development

## Environment Variables

- `PORT` - Port number for the server
- `MONGODB_CLOUD` - MongoDB cloud URL
- `MONGODB_LOCAL` - MongoDB local URL
- `JWT_SECRET` - Secret key for JWT
- `KHALTI_SECRET_KEY` - Secret key for Khalti
- `KHALTI_GATEWAY_URL` - Khalti gateway URL
- `GOOGLE_CLIENT_ID` - Google client ID for OAuth

## Author
