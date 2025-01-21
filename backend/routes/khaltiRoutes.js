const express = require('express');
const router = express.Router();
const {
  initializeKhalti,
  completeKhaltiPayment,
} = require('../controllers/paymentController');
const { authGuard } = require('../middleware/authGuard');

router.post('/initialize_khalti', authGuard, initializeKhalti);
router.get('/complete-khalti-payment', authGuard, completeKhaltiPayment);

module.exports = router;
