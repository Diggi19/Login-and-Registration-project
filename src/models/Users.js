const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
        
    },
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    gender:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true,
        unique:true

        
    },
    confirmpassword:{
        type:String,
        require:true,
        unique:true

    },
})

const Register = new mongoose.model('user',userSchema)

module.exports = Register