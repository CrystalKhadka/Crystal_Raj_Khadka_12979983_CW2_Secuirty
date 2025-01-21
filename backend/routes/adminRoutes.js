const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { adminGuard } = require('../middleware/authGuard');

// Define the route for getting dashboard statistics
router.get('/dashboard_stats', adminGuard, getDashboardStats);

module.exports = router;
