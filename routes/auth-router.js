const { login, reg, authMiddleware, logOut } = require("../controllers/auth-controller")

const router = require("express").Router()

// router.get('/',(req,res) => {
//     res.send("skdaksbh")
// })

router.post('/login',login)
router.post('/logup',reg)
router.post("/logout" , logOut)

router.get("/checkauth",authMiddleware , (req,res) => {
    const user = req.user
    // console.log("user" , user)
    res.json({
        message : "You are authenticated",
        user,
        success : true
    })
})






module.exports = router