// Importing the packages (express)
const express = require('express');
const connectDatabase = require('./database/database');
const dotenv = require('dotenv');
const https = require('https');
const cors = require('cors');
const fs = require('fs');
const accessFormData = require('express-fileupload');

// Load environment variables from .env file
dotenv.config();

// Creating an express app
const app = express();

const options = {
  key: fs.readFileSync('./certificate/server.key'), // Path to your private key
  cert: fs.readFileSync('./certificate/server.crt'), // Path to your certificate
};

// Configure CORS policy
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Block the request
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Restrict allowed methods
  optionsSuccessStatus: 200, // For older browsers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Express JSON Config
app.use(express.json());

// Enable file upload
app.use(accessFormData());

// Connecting to database
connectDatabase();

// File public
app.use(express.static('./public'));

// Defining the port
const PORT = process.env.PORT || 5000;

// Test route
app.get('/test', (req, res) => {
  res.send('Test API is working!.....');
});

// Configuring routes for User and Movie
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/movie', require('./routes/movieRoutes'));
app.use('/api/shows', require('./routes/showsRoutes'));
app.use('/api/seat', require('./routes/seatRoutes'));
app.use('/api/booking', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payment', require('./routes/khaltiRoutes'));

// Configuring routes for Contact Us
app.use('/api/contact', require('./routes/contactRoutes'));

// Starting the HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Secure server is running on https://localhost:${PORT}`);
});

module.exports = app;
