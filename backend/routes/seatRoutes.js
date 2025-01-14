const router=require('express').Router();
const seatController=require('../controllers/seatController');


router.post('/create', seatController.addSeat);

router.get('/get_seats_by_show/:id', seatController.getAllSeatsByShow);

router.put('/setavailable', seatController.setavailable);

module.exports=router