const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const verfiyToken = require('../middleware/check-auth')


const Order = require('../Models/order')


// Need of Population: Whenever in the schema of one collection we provide a reference (in any field) to a
// document from any other collection, we need a populate() method to fill the field with that document

// GET Request
router.get('/',(req,res)=>{
    Order.find()
    .select('_id productId quantity')
    .populate('productId','name price')
    .exec().then((results)=>{
        res.status(200).json({
            success:0,
            message:'Order Got Saved',
            orders:results
        })
    })
})


// GET Request Find By  Id
router.get('/:orderId',(req,res)=>{
    const id = req.params.orderId

    Order.findById(id)
    .select('_id productId quantity')
    .populate('productId','name price')
    .exec().then((results)=>{
        res.status(200).json({
            success:0,
            request:{
                type:'GET',
                description:'You can access to all the orders',
                url:'http://localhost:3006/orders/'
            }
        })
    })
})

// POST Request
router.post('/',verfiyToken,(req,res)=>{
    
    const order=new Order({
        _id:mongoose.Types.ObjectId(),
        quantity:req.body.quantity,
        productId:req.body.productId
        
    })

    order.save().then((results)=>{
        res.status(200).json({
            request:{
                description:'Order Added',
                order:results
            }
        })
    })
})


// Delete Request

router.delete('/:orderId',verfiyToken,(req,res)=>{
    const id = req.params.orderId

    Order.remove({_id:id}).exec().then((results)=>{

        res.status(201).json({
            Success:0,
            message:'Delete Request is running Successfully',
        })
    })

    
});

module.exports=router