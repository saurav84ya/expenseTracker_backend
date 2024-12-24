const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true, // Changed "require" to "required"
  },
  email: {
    type: String,
    required: true, // Changed "require" to "required"
    unique: true,
  },
  password: {
    type: String,
    required: true, // Changed "require" to "required"
  },
  balance: {
    type: Number, // Changed balance type from String to Number for better handling of financial data
    default: 0,
  },
});

const User = model("EtUser", userSchema);

module.exports = User;
