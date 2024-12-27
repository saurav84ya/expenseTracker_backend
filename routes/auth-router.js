const { login, reg, authMiddleware, changePAss,logOut, optSenderController ,otpRecovery,optSenderControllerForRecovery} = require("../controllers/auth-controller")
const { verifyOtp ,verifyOtpRecovery} = require("../middleWare.js/otpVerify")

const router = require("express").Router()

// router.get('/',(req,res) => {
//     res.send("skdaksbh")
// })

router.post('/login',login)
router.post('/logup',verifyOtp,reg)
router.post("/logout" , logOut)

router.get("/logup/getOtp/:email" ,optSenderController )

router.get("/logup/getOtpForRecovery/:email" ,optSenderControllerForRecovery )
router.post("/recover/verifyOtp" , verifyOtpRecovery )
router.post("/recover/changePAss" , changePAss )

router.get("/checkauth",authMiddleware , (req,res) => {
    const user = req.user
    // //("user" , user)
    res.json({
        message : "You are authenticated",
        user,
        success : true
    })
})






module.exports = router