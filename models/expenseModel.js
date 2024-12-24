const { Schema, model } = require("mongoose");

const ExpnseSchima = new Schema(
    {
      userId: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      amount: {
        type: Number, // Changed from String to Number
        required: true
      },
      date: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true,
        maxLength: 50
      },
      description: {
        type: String,
        required: true,
        maxLength: 50
      },
      x : {
        type : String,
        required: true,
      }
    },
    { timestamps: true }
  );
  

const expnseModelSchima = model("EtExpnse", ExpnseSchima);

module.exports = expnseModelSchima;
