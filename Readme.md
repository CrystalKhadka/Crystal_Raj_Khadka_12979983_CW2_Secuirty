# Movie Ticketing System

This project is a **Movie Ticketing System** built using the MERN
(MongoDB,Express.js, React, Node.js) stack. The system includes a frontend and backend designed to provide a secure, scalable, and user-friendly platform for booking movie tickets. The application implements security principles to safeguard user data and enhance reliability.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Frontend Overview](#frontend-overview)
- [Backend Overview](#backend-overview)
- [Security Design Principles](#security-design-principles)
- [Usage](#usage)

---

## Features

- User Authentication and Authorization
- Role-based Access Control (Admin, User)
- Movie and Show Management
- Seat Selection and Ticket Booking
- Payment Gateway Integration
- Admin Dashboard with Analytics
- Responsive Design
- Error Handling and Toast Notifications

---

## Installation

### Prerequisites

- Node.js and npm
- MongoDB

### Backend Setup

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables in a `.env` file:

   ```env
   REACT_APP_API_URL=your_react_port
   PORT = 5000
   MONGODB_CLOUD = your_cloud_mongodb_connection_string
   MONGODB_LOCAL = your_local_mongodb_connection_string
   JWT_SECRET = your_jwt_secret
   KHALTI_SECRET_KEY= your_khalti_secret_key
   KHALTI_GATEWAY_URL = khalti_url
   ALLOWED_ORIGINS= https://localhost:3000,https://localhost:5000
   EMAIL_USER=your_email
   EMAIL_PASS=your_app_password
   JWT_EXPIRY=your_jwt_expiry
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `frontend` folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The application will run at `https://localhost:3000`.

---

## Frontend Overview

The frontend is built using **React** and utilizes:

- **Material-UI (MUI)**: For theming and UI components.
- **React Router**: For routing and navigation.
- **React Toastify**: For toast notifications.
- **Axios**: For API calls.
- **Protected Routes**: To restrict access based on roles.

### File Structure

- **App.js**:
  - Defines the routes for public and protected areas.
  - Integrates `ToastContainer` for notifications and MUI theming.
- **Components**:
  - Reusable UI elements like Navbar, Footer, and charts.
- **Pages**:
  - Structured into directories for public, user, and admin functionalities.
- **ProtectedRoute**:
  - Implements role-based access control.

---

## Backend Overview

The backend is built using **Express.js** and integrates:

- **MongoDB**: For database storage.
- **JWT**: For secure token-based authentication.
- **bcrypt.js**: For hashing passwords.
- **Validation**:
  - Input validation for secure API endpoints.
- **Role-Based API Endpoints**:
  - Separate routes for admin and user actions.

### API Structure

- **User Management**:
  - Registration, Login, OTP Verification, Password Reset.
- **Movie Management**:
  - Create, Read, Update, Delete movies.
- **Booking Management**:
  - Handle bookings, seat availability, and payments.
- **Analytics**:
  - Admin dashboard with activity logs and stats.

Refer to the `api.js` file for detailed API functions.

---

## Security Design Principles

1. **Authentication and Authorization**:

   - Implemented JWT for secure user sessions.
   - Role-based access to protect sensitive endpoints.

2. **Data Validation**:

   - Validate all user inputs on the backend to prevent injection attacks.

3. **Secure Communication**:

   - HTTPS recommended for production.
   - `withCredentials` enabled for secure cookie handling.

4. **Error Handling**:

   - Comprehensive error messages for debugging.
   - Hide sensitive information in production.

5. **Password Security**:

   - Use bcrypt for hashing user passwords.

6. **Rate Limiting and Logging**:
   - Rate limits for API endpoints.
   - Logging activity for admin monitoring.

---

## Usage

1. Start the backend server (on port 5000 by default).
2. Start the frontend server (on port 3000 by default).
3. Access the application at `https://localhost:3000`.
4. Login or register as a user or admin to explore functionality.

---

## Notes

- Ensure MongoDB is running locally or provide a remote connection string.
- Update `.env` file with appropriate values for production.
