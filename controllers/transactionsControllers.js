const incomeModelSchima = require("../models/incomeModel");
const expnseModelSchima = require("../models/expenseModel");
const User = require("../models/User");

const addIncome = async (req, res) => {
  const { title, amount, category, description, date, userId } = req.body;
// //(title, amount, category, description, date, userId)
// //("income addede")
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
      x:"i"
    });

    await income.save();

    user.balance = updatedBalance

    await user.save();

 


    res.json({
      success: true,
      message: "Income added successfully",
    });
  } catch (error) {
    //(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const fetchIncome = async (req, res) => {
  const { userId } = req.params;

// //("incoe fetched")
  // //("userId",userId)

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
  // //(userId,incomeId)

  // //("income deleted")

  try {
    // Validate input parameters
    if (!userId || !incomeId) {
      return res.json({
        success: false,
        message: "Please provide userId and incomeId",
      });
    }

    const user = await User.findOne({_id:userId})

    // //(user.balance)

    const incomeSlice =  await incomeModelSchima.findOne({_id:incomeId})

    // //(incomeSlice.amount)

    const newBalance = Number(user.balance) - Number(incomeSlice.amount)
      // //(newBalance)
    user.balance = newBalance

    await user.save()

    await incomeModelSchima.deleteOne({ _id: incomeId, userId });

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

    const user = await User.findOne({_id:userId})

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }


    const newBalance = Number(user.balance) - Number(amount)

    const expnse = new expnseModelSchima({
      title,
      amount,
      category,
      description,
      date,
      userId,
      x : "e"
    });



    await expnse.save();
    user.balance = newBalance

    await user.save()

    res.json({
      success: true,
      message: "expnse added successfully",
    });
  } catch (error) {
    //(error);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const fetchExpnse = async (req, res) => {
  const { userId } = req.params;

  //(userId)

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

      const balance = await User.findOne({_id:userId})

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
      balance : balance.balance,
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

    const user = await User.findOne({_id:userId})
    const amount = await expnseModelSchima.findOne({_id:expanseId})

    // //(user.balance,amount.amount)

    const newBalance = Number(user.balance) + Number(amount.amount)

    user.balance = newBalance
    await user.save()

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



// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;

//   // //("token" , token)
  
//   if(!token) return res.json({
//     success: false,
//     message : "Unauthrosid user!"
//   })

//   try {
//     const decoded = jwt.verify(token,process.env.JWT_SECRET)

//       // //(decoded)
//       const email = decoded.email
//   //   //(email)

//     const user = await User.findOne({email})

//     const existUser =   {
//       id : user._id,
//       name : user.name,
//       email : user.email,
//       balance : user.balance
//   }

//   //   //(user)

//     req.user = existUser
//     next()
//   } catch (error) {
//       //(error)
//    res.json({
//     success : false ,
//    }) 
//   }
// }



const dashBoardInfo = async (req,res) => {
  const {userId} = req.params

  try {

    if(!userId){
      res.json({
        success : false,
        message : "Plz Provide UserId"
      })
    }

    const incomes = await incomeModelSchima
      .find({userId : userId})
      .sort({ createdAt: -1 });


    const expnses = await expnseModelSchima
      .find({ userId })
      .sort({ createdAt: -1 });

      res.json({
        success : true,
        message : "data fetched sucesfully",
        incomes : incomes ,
        expnses : expnses,
      })

  } catch (error) {
    res.json({
        success : false,
        message : "server not responding"
      })
  }
}

module.exports = {
  addIncome,
  fetchIncome,
  deleteIncome,
  addExpnse,
  fetchExpnse,
  deleteExpnse,
  dashBoardInfo
};
