// module.exports = router
const router = require('express').Router();
const userController = require('../controllers/userController');
const {
  authGuard,
  adminGuard,
  publicGuard,
} = require('../middleware/authGuard');

// Creating user registration route
router.post('/create', publicGuard, userController.createUser);

// Creating login route
router.post('/login', publicGuard, userController.loginUser);

// Creating user forgot password route
router.post('/forgot-password', publicGuard, userController.forgotPassword);

// Creating user reset password route
router.post('/reset-password', publicGuard, userController.resetPassword);

// Route to fetch all users
router.get('/get_all_users', adminGuard, userController.getAllUsers);

// User Profile route
router.get('/get_single_profile', authGuard, userController.getSingleProfile);
router.put('/update_profile', authGuard, userController.updateUser);

//generate token
router.post('/generate_token', publicGuard, userController.getToken);

// exporting the router
module.exports = router;
