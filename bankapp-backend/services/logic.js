// import db.js 
const db=require('./db')

//import jw token
const jwt=require('jsonwebtoken')

//logic for register - asynchronous function-> promise - .then
const register =(acno,username,password)=>{
    console.log('register works')
    //acno in db?
    //yes
    return db.User.findOne({acno}).then((response)=>{
        // console.log(response);
        if(response){
            return{
                statusCode:401,
                message:'Acno Already Regsitered'

            }
        }
        else{
            //new object for registration
            const newUser=new db.User({
                acno,
                username,
                password,
                balance:2000,
                transaction:[]
            })
            //to save in database
            newUser.save()
            //to send response back to the client
            return{
                statusCode:200,
                message:'Successfully registered',
                
            }

        }
    })
}

//logic for register - asynchronous function-> promise - .then
const login=(acno,password)=>{
    console.log('inside the login function')
    console.log(acno)
    return db.User.findOne({acno,password}).then((result)=>{
      //acno present in database
        if(result){
            //token generated just below .parameters acno and secret key
            const token=jwt.sign({loginAcno:acno},'superkey2023')
            return{
                statusCode:200,
                message:'Successfully logged in', 
                currentUser:result.username,        
                token, //send to the client
                currentAcno:acno
            }
        }
        else{
            //acno not present in database
            return{
                statusCode:401,
                message:'Invalid Data'
            }
        }
    })
}

//logic for balance enquiry
const getBalance=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{
              statusCode:401,
              message:'Invalid Data'
            }
        }
    })
}

//fund transfer
const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{

    //convert amt into number
    let amount=parseInt(amt)

    //check fromAcno in mongoDB
    return db.User.findOne({
        acno:fromAcno,
        password:fromAcnoPswd
    }).then((debitdetails)=>{
        if(debitdetails){  //if from acno and pass is rpesent
            return db.User.findOne({acno:toAcno}).then((creditDetails)=>{  
                if(creditDetails){    // check if to acno 
                    if(debitdetails.balance>amount){
                        debitdetails.balance-=amount;
                        // console.log(debitdetails)  
                //pushing debit_details to transaction array in Debit_acc 
                        debitdetails.transaction.push({  
                            type:'Debit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save changes to mongodb
                        debitdetails.save()

                        //update toAcno
                        creditDetails.balance+=amount
                        creditDetails.transaction.push({
                            type:'credit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        //save to MongoDB
                        creditDetails.save()

                        //send response to the client side
                        return{
                            statusCode:200,
                            message:'Fund Transfer successful'
                        }


                    }
                    else{
                        return{
                            statusCode:401,
                            message:'Insufficient Balance'
                          }
                    }
                }
                else{   
                    return{
                        statusCode:401,
                        message:'Invalid Datas'
                      }
                }
            })
        }
        else{   //else of fromAcc
            return{
                statusCode:401,
                message:'Invalid Data'
              }
        }
    })
}

//logic for transaction history
const getTransationHistory=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transaction:result.transaction
            }
        }
        else{
            return{
                statusCode:401,
                message:"Account does not exist"
            }
        }
    })
}

    //logic to delete account
    const deleteUserAccount=(acno)=>{
        //acno delete from MongoDB
        return db.User.deleteOne({acno}).then((result)=>{
            return{
                statusCode:200,
                message:'Account deleted Successfully'
            }
        })
    }

//export
module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    getTransationHistory,
    deleteUserAccount
}