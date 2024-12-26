const mongoose =require("mongoose")

const db = async ()=> {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        //("database connected")
    } catch (error) {
        //("connection to database failed " , error)
    }
}

module.exports = {db}