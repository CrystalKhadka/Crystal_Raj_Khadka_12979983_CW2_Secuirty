// Importing the packages (express)
const express = require('express');
const connectDatabase = require('./database/database');
const dotenv = require('dotenv');
const cors = require('cors');
const accessFormData = require('express-fileupload');

// Load environment variables from .env file
dotenv.config();

// Creating an express app
const app = express();

const options = {
  key: fs.readFileSync('./certificate/server.key'), // replace it with your key path
  cert: fs.readFileSync('./certificate/server.crt'), // replace it with your certificate path
}

// Configure CORS policy
const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
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

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});

module.exports = app;
