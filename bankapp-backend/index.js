//1 import express
const express = require("express"); 

//4 import cors
const cors = require("cors");

//8 import logic.js
const logic=require("./services/logic")

//import jwttoken
const jwt = require('jsonwebtoken')

//2 create a server using express
  const server=express();

//5  use cors in server app
server.use(cors({
    origin:"http://localhost:4200"
}))  

//6 Parse json data to the js in server app
server.use(express.json())



//to resolve client request - 5000 /
// server.get("/",(req,res)=>{
//     res.send('GET METHOD')
// })

// server.post("/",(req,res)=>{
//     res.send('POST METHOD')
// })


//3 setup port server  
   server.listen(5000,()=>{
    console.log("Listening on the port 5000")
   }) 
   
//application specific middleware
const appMiddleware = (req,res,next)=>{
  next()
  console.log('Application specific middleware')
}
//use  application specific middleware
server.use(appMiddleware)

//router specific middleware
//middleware veriyinf token to check user is logged in or not
const jwtMiddleware = (req,res,next)=>{

 //get token from req header
 const token=req.headers['verify-token']; //token
 console.log(token); //token verify
  try{
    const data=jwt.verify(token,'superkey2023')
    console.log(data);
    req.currentAcno=data.loginAcno  //just look passing to fund transfer
    next()
  }
  catch{
    res.status(401).json({message:'please login'})
  }

 console.log('Router specific middleware') 

}



//bank request 
//register
//login 
//balance enquiry
//fund transfer

//7register
server.post('/register',(req,res)=>{

  logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{
    res.status(result.statusCode).json(result)
  })
    // res.send ('Register request recieved')
    // res.status(200).json({message:'Request Received'})
})

//8 login api call
server.post('/login',(req,res)=>{
  console.log('inside the login api call');
  console.log(req.body)
  logic.login(req.body.acno,req.body.password).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})

//getBalance api call
server.get('/getbalance/:acno',jwtMiddleware,(req,res)=>{
  console.log('inside getBalance')
  console.log(req.params);
  logic.getBalance(req.params.acno).then((result)=>{
    res.status(result.statusCode).json(result)

  })
})

//fund transfer api call
server.post('/fund-transfer',jwtMiddleware,(req,res)=>{
  console.log('inside the fund transfer')
  console.log(req.body)
   //getting acno from jwt middleware above
  logic.fundTransfer(req.currentAcno,req.body.password,req.body.toAcno,req.body.amount)  
  .then((result)=>{
    res.status(result.statusCode).json(result)
  })
})

//transaction history api call
server.get('/getTransationHistory',jwtMiddleware,(req,res)=>{
  console.log('Inside getTransationHistory')
  logic.getTransationHistory(req.currentAcno).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})

//delete acc api call
server.delete('/delete-account',jwtMiddleware,(req,res)=>{
  console.log('Inside deleteAccount')
  logic.deleteUserAccount(req.currentAcno).then((result)=>{
    res.status(result.statusCode).json(result)
  })
})

