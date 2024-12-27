
const {OtpModel} = require("../models/otpModel") 

const deleteOtp = async (email) => {
  try {
     await OtpModel.findOneAndDelete({email})
    
  } catch (err) {
    console.error("Error deleting OTP:", err);
  }
};

const getOtp = async (email) => {
  try {
    const otp = await  OtpModel.findOne({email})
    return otp
  } catch (err) {
    console.error("Error retrieving OTP:", err);
    return null;
  }
};

const setOtp = async (email, currentOtp) => {
  try {
    const newOtp = new OtpModel({
      email,
      currentOtp,
    });

    await newOtp.save();
  } catch (err) {
    console.error("Error storing OTP:", err);
  }
};

module.exports = {  deleteOtp, setOtp, getOtp };
