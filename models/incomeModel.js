const { Schema, model } = require("mongoose");

const IncomeSchima = new Schema(
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
      }
    },
    { timestamps: true }
  );
  

const incomeModelSchima = model("EtIncome", IncomeSchima);

module.exports = incomeModelSchima;
