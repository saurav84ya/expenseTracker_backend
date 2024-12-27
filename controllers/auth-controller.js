const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const { sendOtpToEmail, verifyOtp } = require("../middleWare.js/otpVerify");



const otpRecovery = async (req,res) => {

}

const reg = async (req,res) => {
    const {name,email,password} = req.regUser;
    // //(name,email,password)

    ("name,email,password" , name,email,password)

    try {
        const hashPassword = await bcrypt.hash(password , 12);

        const newUser = new User({
            name,email,password:hashPassword
        })

        await newUser.save()


        const token = jwt.sign(
            {
                id : newUser._id,
                name : newUser.name,
                email:newUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "360000m" }
        )


        res
            .cookie("token" , token ,  { httpOnly: true})
            .json({
                success : true,
                message:"Registered sucessfull",
                user : {
                    id : newUser._id,
                    name : newUser.name,
                    email :newUser.email,
                    balance : newUser.balance
                }
            })




    } catch (error) {
        //("error at reg controller",error)
        res.json({
            success:false,
            message : "Some error occurred, please try again later."
        })
    }

}

const login = async (req,res) => {

    const { email ,password} = req.body
    //(email,password)

    try {

        const isUserExist = await User.findOne({email})
        if(!isUserExist){
            return res.json({
                success :false ,
                message : "Email not Regstered , try login"
            })
        }


        const checkPasswordMatch = await bcrypt.compare(password , isUserExist.password)

        if(!checkPasswordMatch) {
            return res.json({
                success : false,
                message : "Invailed Password",
                help : true
            })
        }

        const token = jwt.sign(
            {
                id: isUserExist._id,
                name : isUserExist.name,
                email:isUserExist.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "360000m" }
        )



        res
        .cookie("token" , token ,  { httpOnly: true})
            .json({
                success : true ,
                message : "Logged in Successfully",
                user:   {
                    id : isUserExist._id,
                    name : isUserExist.name,
                    email : isUserExist.email,
                    balance : isUserExist.balance
                }
            })



    } catch (error) {
        //("error at login controller")
        res.json({
            success:false,
            message : "Some error occurred, please try again later."
        })
    }
    
}


const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    // //("token" , token)
    
    if(!token) return res.json({
      success: false,
      message : "Unauthrosid user!"
    })
  
    try {
      const decoded = jwt.verify(token,process.env.JWT_SECRET)

        // //(decoded)
        const email = decoded.email
    //   //(email)

      const user = await User.findOne({email})

      const existUser =   {
        id : user._id,
        name : user.name,
        email : user.email,
        balance : user.balance
    }

    //   //(user)

      req.user = existUser
      next()
    } catch (error) {
        //(error)
     res.json({
      success : false ,
     }) 
    }
  }


const logOut = async (req,res) => {

    // //("logout")
    res.clearCookie("token" , {
        httpOnly : true,
        path : "/"
    } )
    res.json({
        success : true ,
        message : "Logged out succesfully"
    })
}

const optSenderController = async (req, res) => {
    const { email } = req.params;
    // ("email", email);
    
    try {
        const isExist = await User.findOne({ email });
        
        if (isExist) {
            // Send the response and exit the function
            return res.json({
                success: false,
                message: "Email already exists",
            });
        }

        // If email doesn't exist, proceed with sending the OTP
        // Assuming you have a function `sendOtpToEmail` that sends the OTP
        await sendOtpToEmail(email);

        // Send the response after sending the OTP
        res.status(200).json({
            success: true,
            message: "OTP sent to your email successfully."
        });
    } catch (error) {
        // If an error occurs, handle it by sending the response and exit
        res.json({
            success: false,
            message: "Failed to send OTP. Please try again later."
        });
    }
};

const optSenderControllerForRecovery = async (req, res) => {
    const { email } = req.params;
    ("email", email);
    
    try {
        const isExist = await User.findOne({ email });
        
        if (!isExist) {
            // Send the response and exit the function
            return res.json({
                success: false,
                message: "Email Dont exists",
            });
        }

        // If email doesn't exist, proceed with sending the OTP
        // Assuming you have a function `sendOtpToEmail` that sends the OTP
        await sendOtpToEmail(email);

        // Send the response after sending the OTP
        res.status(200).json({
            success: true,
            message: "OTP sent to your email successfully."
        });
    } catch (error) {
        // If an error occurs, handle it by sending the response and exit
        res.json({
            success: false,
            message: "Failed to send OTP. Please try again later."
        });
    }
};



const changePAss = async (req, res) => {
    const { password } = req.body;
    const email = req.cookies.email; // Ensure you have middleware to parse cookies

    ("email,password:", email, password);

    try {
        // Validate input
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Unauthorized user or missing data!",
            });
        }

        // Hash the new password
        const hashedPass = await bcrypt.hash(password, 12);

        // Update the user's password
        const updatedUser = await User.findOneAndUpdate(
            { email: email },               // Find user by email
            { $set: { password: hashedPass } }, // Update the password
            { new: true }                   // Return the updated document
        );

        // Check if user was found and updated
        if (!updatedUser) {
            return res.json({
                success: false,
                message: "User not found!",
            });
        }

        // Clear the email cookie
        res.clearCookie("email", {
            httpOnly: true, // Ensures cookie cannot be accessed via JavaScript
            path: "/",      // Clear the cookie across the entire app
        });

        // Respond with success
        res.status(200).json({
            success: true,
            message: "Password updated successfully!",
        });

    } catch (error) {
        console.error("Error updating password:", error);
        res.json({
            success: false,
            message: "Internal server error.",
        });
    }
};





module.exports = {reg,changePAss,otpRecovery,login,authMiddleware,logOut,optSenderController,optSenderControllerForRecovery}