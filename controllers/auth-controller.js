const User = require("../models/User");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



const reg = async (req,res) => {
    const {name,email,password} = req.body;
    // //(name,email,password)

    try {

        const isUserExist = await User.findOne({email})
        if(isUserExist){
            return res.json({
                success : false , 
                message : "Email already exist use diffrent email"
            })
        }


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
                message : "Invailed Password"
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

module.exports = {reg,login,authMiddleware,logOut}