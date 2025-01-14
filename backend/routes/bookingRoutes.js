const router=require('express').Router();
const bookingController=require('../controllers/bookingController');
const { authGuard } = require('../middleware/authGuard');

router.post('/create',authGuard, bookingController.addBooking);

router.get('/get_booking', bookingController.getBooking);

router.get('/get_all_bookings', bookingController.getAllBookings);

router.get('/get_bookings_by_user', authGuard, bookingController.getBookingsByUser);

router.get('/get_by_id/:id', bookingController.getBookingById);

router.put('/change_status/:id', authGuard, bookingController.changeStatus);

module.exports=router