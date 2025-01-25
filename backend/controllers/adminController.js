const User = require('../models/userModel');
const Movie = require('../models/movieModel');
const Bookings = require('../models/bookingModel');
const Logs = require('../models/logModel');

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

// get all logs
const getAllLogs = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const logs = await Logs.find({})
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs' });
  }
};

module.exports = { getDashboardStats, getAllLogs };
