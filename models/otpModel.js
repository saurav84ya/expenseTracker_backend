const { Schema, model } = require("mongoose");

const otpSchema = new Schema({
  email: {
    type: String,
    required: true, // Fixed typo 'require' -> 'required'
  },
  currentOtp: {
    type: String,
    required: true, // Fixed typo 'require' -> 'required'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // 300 seconds = 5 minutes (time-to-live)
  },
});

// Create the model
const OtpModel = model("ETotp", otpSchema);

module.exports = { OtpModel };
