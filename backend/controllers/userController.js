const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOtp = require('../service/sendotp');
const User = require('../models/userModel');
const { OAuth2Client } = require('google-auth-library');
const {
  sendLoginVerificationEmail,
  sendRegisterOtp,
} = require('../service/sendEmail');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createUser = async (req, res) => {
  // 1. Check incoming data
  console.log(req.body);

  // 2. Destructure the incoming data
  const { email, username, phoneNumber, password } = req.body;

  // 3. Validate the data (if empty, stop the process and send response)
  if (!username || !phoneNumber || !email || !password) {
    // res.send("Please enter all fields!")
    return res.json({
      success: false,
      message: 'Please enter all fields!',
    });
  }

  // 4. Error Handling (Try Catch)
  try {
    // 5. Check if the user is already registered
    const existingUser = await userModel.findOne({ email: email });

    // 5.1 if user found: Send response
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User Already Exists!',
      });
    }

    // Hashing/Encryption of the password
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    // 5.2 if user is new:
    const newUser = new userModel({
      // Database Fields  : Client's Value
      username: username,
      phoneNumber: phoneNumber,
      email: email,
      password: hashedPassword,
      oldPasswords: [hashedPassword],
      passwordExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    console.log(newUser);

    // Save to database
    await newUser.save();

    // send the response
    res.status(201).json({
      success: true,
      message: 'User Created Successfully!',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error!',
    });
  }
};

const loginUser = async (req, res) => {
  console.log(req.body); // Log incoming data for debugging

  const { email, password } = req.body;
  const device = req.headers['user-agent']; // Identify the device using User-Agent

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please enter all fields',
    });
  }

  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist!',
      });
    }

    if (user.isLocked) {
      return res.status(403).json({
        success: false,
        message: `Account is locked. Try again after ${new Date(
          user.accountLockUntil
        ).toLocaleString()}`,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      await user.incrementLoginAttempts();
      const attemptsRemaining = 5 - user.loginAttempts;
      const lockMessage = user.isLocked
        ? `Your account is locked until ${new Date(
            user.accountLockUntil
          ).toLocaleString()}`
        : `Invalid password. ${attemptsRemaining} attempt(s) remaining.`;

      return res.status(400).json({
        success: false,
        message: lockMessage,
      });
    }

    // If login is successful, reset login attempts
    await user.resetLoginAttempts();

    if (!user.isVerified) {
      // Generate OTP for verification
      const randomOTP = Math.floor(100000 + Math.random() * 900000);
      console.log(randomOTP);

      user.verifyOTP = randomOTP;
      user.verifyExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      // Save the OTP in the database
      await user.save();

      // Send OTP to the user's email
      const sent = await sendRegisterOtp(email, randomOTP);

      if (!sent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'OTP sent to your email. Verify to continue.',
        registerOtpRequired: true,
      });
    }

    // Check if the device is new
    if (!user.rememberedDevices.includes(device)) {
      // Generate OTP for verification
      const randomOTP = Math.floor(100000 + Math.random() * 900000);
      console.log(randomOTP);

      user.verifyOTP = randomOTP;
      user.verifyExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      // Save the OTP in the database
      await user.save();

      // Send OTP to the user's email
      const sent = await sendLoginVerificationEmail(email, randomOTP);

      if (!sent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'OTP sent to your email. Verify to continue.',
        otpRequired: true,
      });
    }

    // If device is recognized, issue token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.loginDevices.push(device);
    await user.save();

    // Respond with the token
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token: token,
      userData: {
        id: user._id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

// verify otp
const verifyRegisterOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Just take the device info not the time
    const device = req.headers['user-agent'];
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.verifyExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }

    if (user.verifyOTP !== parseInt(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    user.isVerified = true;

    // If the account is verified, generate a token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.loginDevices.push(device);
    user.verifyOTP = null;
    user.verifyExpires = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully!',
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const device = req.headers['user-agent'];
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    if (user.verifyExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }
    if (user.verifyOTP !== parseInt(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    user.loginDevices.push(device);
    user.verifyOTP = null;
    user.verifyExpires = null;

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully!',
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const forgotPassword = async (req, res) => {
  console.log(req.body);

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'Please enter your phone number',
    });
  }
  try {
    const user = await userModel.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    // Generate OTP
    const randomOTP = Math.floor(100000 + Math.random() * 900000);
    console.log(randomOTP);

    user.resetPasswordOTP = randomOTP;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
    await user.save();

    // Send OTP to user phone number
    const isSent = await sendOtp(phoneNumber, randomOTP);

    if (!isSent) {
      return res.status(400).json({
        success: false,
        message: 'Error in sending OTP',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your phone number',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const resetPassword = async (req, res) => {
  console.log(req.body);

  const { phoneNumber, otp, password } = req.body;

  if (!phoneNumber || !otp || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please enter all fields',
    });
  }

  try {
    const user = await userModel.findOne({ phoneNumber: phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    // Otp to integer
    const otpToInteger = parseInt(otp);

    if (user.resetPasswordOTP !== otpToInteger) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired',
      });
    }

    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find({});
    res.status(200).json({
      success: true,
      message: 'users fetched successfully',
      users: allUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// Fetch single user profile
const getSingleProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No User Found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User fetched',
      user: {
        username: user.username,
        phoneNumber: user.phoneNumber,
        email: user.email,
        password: 'Please update your password',
        _id: user._id,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error,
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  const id = req.user.id;
  const { password, ...restBody } = req.body; // Destructure password from req.body

  try {
    // Check if rememberDevice is true

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    if (restBody.rememberDevice) {
      const device = req.headers['user-agent'];
      user.rememberedDevices.push(device);
    }

    user.username = restBody.username;
    user.phoneNumber = restBody.phoneNumber;
    user.email = restBody.email;

    const updatedUser = await user.save();

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (err) {
    console.error('Error updating User:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update',
      error: err.message,
    });
  }
};
// get token
const getToken = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: 'Token generated successfully!',
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error,
    });
  }
};

const googleLogin = async (req, res) => {
  console.log(req.body);
  // Destructuring the data
  const { token } = req.body;
  // Validate
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Please fill all the fields',
    });
  }
  // try catch
  try {
    // verify token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, given_name } = ticket.getPayload();
    let user = await userModel.findOne({ email: email });
    if (!user) {
      const { password } = req.body;
      const randomSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, randomSalt);
      user = new userModel({
        username: given_name,
        email: email,
        password: hashedPassword,
        phoneNumber: '',
      });
      await user.save();
    }
    // generate token
    const jwtToken = await jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      (options = {
        expiresIn: Date.now() + 20 * 24 * 60 * 60 * 1000 || '1d',
      })
    );
    return res.status(200).json({
      success: true,
      message: 'User Logged In Successfully!',
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error!',
      error: error,
    });
  }
};
const getUserByGoogleEmail = async (req, res) => {
  console.log(req.body);
  // Destructuring the data
  const { token } = req.body;
  // Validate
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Please fill all the fields',
    });
  }
  try {
    // verify token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email } = ticket.getPayload();
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(200).json({
        success: true,
        message: 'User found',
        data: user,
      });
    }
    res.status(201).json({
      success: false,
      message: 'User not found',
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: e,
    });
  }
};

// Exporting
module.exports = {
  createUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getAllUsers,
  getSingleProfile,
  updateUser,
  getToken,
  googleLogin,
  getUserByGoogleEmail,
  verifyRegisterOTP,
  verifyLoginOTP,
};
