const express = require('express')
const router = express.Router()
const mongoose =require('mongoose')
const bcrypt =  require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../Models/user')


// Get User
router.get('/',(req,res)=>{
    User.find().select('email _id password').exec().then((result)=>{
        res.status(200).json({
            users:result
        })
    })
})


// Login
router.post('/login',(req,res)=>{
    User.find({email:req.body.email})
    .exec()
    .then((user)=>{
        if(user.length<1){
            return res.status(401).json({
                message:'Auth Fail'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:'Wrong Credentials hi'
                })
            }
            else{
                jwt.sign({userId:user[0]._id,email:user[0].email,password:user[0].password},'secretKey',{expiresIn:'1h'},(err,token)=>{
                    if(err){
                        return res.status(401).json({
                            message:'Wrong Credentials hiiiii'
                        })
                    }
                    else{
                       res.status(200).json({
                        token:token,
                        message:'Auth Successful'
                       });
                    };
                });
            };
        });
    });
});

// Create User
router.post('/signUp',(req,res)=>{

    User.find({email:req.body.email})
    .exec().then((result)=>{
    if(result.length>=1){
       return res.send({
            message:'User Exists'
        });
    }
    else{
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
                res.status(500).json({
                    error:{
                        message:'Unable to convert the password'
                    }
                })
            }
            else{
    
                const user=new User({
                    _id:mongoose.Types.ObjectId(),
                    email:req.body.email,
                    password:hash   
                });
    
                user.save().then((result)=>{
                    res.status(200).json({
                        message:'User Saved',
                        user:result
                    })
                });
    
            };
        });
    };
    })
    
})


router.delete('/:userId',(req,res)=>{
    const id = req.params.userId

    Order.remove({_id:id}).exec().then((results)=>{

        res.status(201).json({
            Success:0,
            message:'Delete Request is running Successfully',
        })
    })

    
});

module.exports=router