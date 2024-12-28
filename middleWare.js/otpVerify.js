const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User");
const { setOtp, getOtp, deleteOtp } = require("./redis");

// Function to send OTP to email
const sendOtpToEmail = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP

  // Store OTP in Redis
  await setOtp(email, otp);

  // Create a transporter using your email provider
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use Gmail or any other email provider
    auth: {
      user: process.env.EMAIL, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password (or app-specific password)
    },
  });

  const mailOptions = {
    from: "Expanse Tracker",
    to: email,
    subject: "Your OTP for Registration",
    text: `Your OTP for registration is ${otp}. It will expire in 5 minutes.`,
  };

  // Send the OTP email
  await transporter.sendMail(mailOptions);
  return otp;
};







const verifyOtpRecovery = async (req, res) => {
  const { email, otp } = req.body;


  // Validate input data
  if (!otp || !email) {
    res.clearCookie("email"); // Clear the cookie if any
    return res.json({
      success: false,
      message: "Please provide all required data.",
    });
  }

  // Check if email already exists
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    res.clearCookie("email"); // Clear the cookie if any
    return res.json({
      success: false,
      message: "Email doesn't exist",
    });
  }

  const storedOtp = await getOtp(email);

  (storedOtp?.currentOtp);

  if (!storedOtp?.currentOtp) {
    res.clearCookie("email"); // Clear the cookie if any
    return res.json({
      success: false,
      message: "OTP not found. Please request a new OTP.",
    });
  }

  // Verify OTP

  
  if (storedOtp?.currentOtp === otp) {
    await deleteOtp(email);
  } else {
    res.clearCookie("email"); // Clear the cookie if any
    return res.json({
      success: false,
      message: "Invalid OTP",
    });
  }

  const token = isUserExist?.email

  // Send cookie and success response if OTP is valid
  res
  .cookie("email" , token ,  { httpOnly: true})
    .json({
      success: true,
      isAlloudes: true,
      message: "Now you can change your password",
    });
};








// Function to verify OTP
const verifyOtp = async (req, res, next) => {
  const { name, email, password, otp } = req.body;


  // Validate input data
  if (!otp || !name || !password || !email) {
    return res.json({
      success: false,
      message: "Please provide all required data.",
    });
  }

  // Check if email already exists
  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return res.json({
      success: false,
      message: "Email already exists, please use a different email.",
    });
  }

  // Retrieve OTP from Redis
  const storedOtp = await getOtp(email);


  if (!storedOtp?.currentOtp) {
    return res.json({
      success: false,
      message: "OTP not found. Please request a new OTP.",
    });
  }

  // Verify OTP
  if (storedOtp?.currentOtp === otp) {
    await deleteOtp(email); // Delete OTP after verification

    // Attach user data to the request for the next middleware
    req.regUser = { name, email, password };
    next(); // Proceed to the next middleware (registration)
  } else {
    return res.json({
      success: false,
      message: "Invalid OTP. Please try again.",
    });
  }
};

module.exports = { verifyOtp, verifyOtpRecovery, sendOtpToEmail };
