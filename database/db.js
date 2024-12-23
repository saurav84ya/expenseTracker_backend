const mongoose =require("mongoose")

const db = async ()=> {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected")
    } catch (error) {
        console.log("connection to database failed " , error)
    }
}

module.exports = {db}