// Database connection with NODEJS

//import mongoose

const mongoose= require('mongoose');

//define a connection string  between express and mongoDB
mongoose.connect('mongodb://localhost:27017/BankServer')   //copy from mongodb  

//create a model and schema for storing data in to the database
//model- User
//model in express same as mongodb collection name (but in capitalcase and singular form , eg- users-> User )
const User= mongoose.model('User',{         //following is schema of model
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

//export the collection
module.exports ={
    User
} 