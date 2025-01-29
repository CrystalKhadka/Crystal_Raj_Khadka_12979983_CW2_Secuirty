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

// verifyRegisterOTP
router.put(
  '/verify_register_otp',
  publicGuard,
  userController.verifyRegisterOTP
);

// verifyLoginOTP
router.put('/verify_login_otp', publicGuard, userController.verifyLoginOTP);

// uploadProfilePicture
router.post(
  '/upload_profile_picture',
  authGuard,
  userController.uploadProfilePicture
);

// delete
router.delete('/delete', authGuard, userController.deleteUser);

// logout
router.post('/logout', authGuard, userController.logoutUser);

// exporting the router
module.exports = router;
