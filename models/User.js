const {Schema , model} = require("mongoose")


const userSchima = new Schema({
    name:{
        type : String,
        require : true
    },
    email:{
        type : String,
        require : true,
        unique: true
    },
    password : {
        type : String ,
        require :true
    }

})

const User = model("EtUser" , userSchima)

module.exports = User;