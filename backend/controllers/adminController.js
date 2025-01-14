
const User = require('../models/userModel');
const Movie = require('../models/movieModel');
const Bookings = require('../models/bookingModel');

const getDashboardStats = async (req, res) => {
  try {
    const totalUserLogins = await User.countDocuments({});
    const totalMoviesAdded = await Movie.countDocuments({});
    const totalBookings = await Bookings.countDocuments({});

    res.status(200).json({
      totalUserLogins,
      totalMoviesAdded,
      totalBookings,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};
module.exports = { getDashboardStats };