const incomeModelSchima = require("../models/incomeModel");
const expnseModelSchima = require("../models/expenseModel");
const User = require("../models/User");

const addIncome = async (req, res) => {
  const { title, amount, category, description, date, userId } = req.body;
// console.log(title, amount, category, description, date, userId)
// console.log("income addede")
  try {
    if (!title || !category || !description || !date || !userId) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      return res.json({
        success: false,
        message: "Amount must be a positive number",
      });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }


    const updatedBalance = Number(user.balance) + Number(amount);





    const income = new incomeModelSchima({
      title,
      amount,
      category,
      description,
      date,
      userId,
    });

    await income.save();

    user.balance = updatedBalance

    await user.save();

 


    res.json({
      success: true,
      message: "Income added successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const fetchIncome = async (req, res) => {
  const { userId } = req.params;

// console.log("incoe fetched")
  // console.log("userId",userId)

  try {
    if (!userId) {
      return res.json({
        success: false,
        message: "plz Provide userId",
      });
    }

    const incomes = await incomeModelSchima
      .find({ userId })
      .sort({ createdAt: -1 });

    const balance = await User.findOne({_id:userId})

    if (!incomes) {
      return res.json({
        success: true,
        message: "no data",
      });
    }

    res.json({
      success: true,
      message: "data found",
      data: incomes,
      balance : balance.balance,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "something went erong",
    });
  }
};

const deleteIncome = async (req, res) => {
  const { userId, incomeId } = req.params;
  // console.log(userId,incomeId)

  // console.log("income deleted")

  try {
    // Validate input parameters
    if (!userId || !incomeId) {
      return res.json({
        success: false,
        message: "Please provide userId and incomeId",
      });
    }

    const user = await User.findOne({_id:userId})

    // console.log(user.balance)

    const incomeSlice =  await incomeModelSchima.findOne({_id:incomeId})

    // console.log(incomeSlice.amount)

    const newBalance = Number(user.balance) - Number(incomeSlice.amount)
      // console.log(newBalance)
    user.balance = newBalance

    await user.save()

    // await incomeModelSchima.deleteOne({ _id: incomeId, userId });

    res.json({
      success: true,
      message: "Income record deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteIncome:", error);
    res.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

const addExpnse = async (req, res) => {
  const { title, amount, category, description, date, userId } = req.body;

  try {
    if (!title || !category || !description || !date || !userId) {
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate amount

    const expnse = new expnseModelSchima({
      title,
      amount,
      category,
      description,
      date,
      userId,
    });

    await expnse.save();

    res.json({
      success: true,
      message: "expnse added successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const fetchExpnse = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.json({
        success: false,
        message: "plz Provide userId",
      });
    }

    const expnses = await expnseModelSchima
      .find({ userId })
      .sort({ createdAt: -1 });

    if (!expnses) {
      return res.json({
        success: true,
        message: "no data",
      });
    }

    res.json({
      success: true,
      message: "data found",
      data: expnses,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "something went erong",
    });
  }
};

const deleteExpnse = async (req, res) => {
  const { userId, expanseId } = req.params;

  try {
    // Validate input parameters
    if (!userId || !expanseId) {
      return res.json({
        success: false,
        message: "Please provide userId and incomeId",
      });
    }

    await expnseModelSchima.deleteOne({ _id: expanseId, userId });

    res.json({
      success: true,
      message: "Expnse record deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteExpnse:", error);
    res.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = {
  addIncome,
  fetchIncome,
  deleteIncome,
  addExpnse,
  fetchExpnse,
  deleteExpnse,
};
