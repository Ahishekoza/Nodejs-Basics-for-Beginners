const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

// MiddleWare which Verifies the token
const verfiyToken = require('../middleware/check-auth')

// Refer The following Blog For Multer
// https://expressjs.com/en/resources/middleware/multer.html

// Image / File Upload
const multer = require('multer')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
      cb(null,'./uploads/')
    },
    filename:function(req,file,cb){
      cb(null,file.originalname)
    }
})
const uploadImage =  multer({storage:storage})

// Model/Object 
const Product = require('../Models/product')



// ------------Get Request to get data
router.get('/',(req,res)=>{

   Product.find().select('name price productImage _id').exec().then((results)=>{
        res.status(200).json({
            Success:0,
            products:results.map(doc=>{
                return{
                    id:doc._id,
                    name:doc.name,
                    price:doc.price,
                    request:{
                        type:'GET',
                        description:'Get Detail Information of Product',
                        url:'http://localhost:3006/products/'+doc._id
                    }
                }
            }),
           
        })
    })

});

// ----Get Product By Id
router.get('/:productId',(req,res)=>{
    const id=req.params.productId

    Product.findById(id).select('name price productImage _id').exec().then((results)=>{     
        res.status(200).json({
            Success:0,
            request:{
                type:'GET',
                product:results,
                description:'Get All Products',
                url:'http://localhost:3006/products/'
            }

        })
    })

});


// Add New Data ie Post Request
router.post('/',uploadImage.single('productImage'),verfiyToken,(req,res)=>{

    const product=new Product({
      _id:new mongoose.Types.ObjectId(),
      name:req.body.name,
      price:req.body.price,
      productImage:req.file.path
    })

    product.save().then((results)=>{
        res.status(201).json({
            Success:0,
            message:'Product Saved Successfully',
            product:product
        })
    })

   
});

// Update Request
router.patch('/:productId',verfiyToken,(req,res)=>{
    const id = req.params.productId
    const product = req.body

    Product.findByIdAndUpdate(id,product).select('name price _id').exec().then((results)=>{
        res.status(200).json({
            message:'Data Updated Successfully',
            UpdatedProduct:product
        })
    })
});

// Delete Request

router.delete('/:productId',verfiyToken,(req,res)=>{
    const id = req.params.productId

    Product.remove({_id:id}).exec().then((results)=>{

        res.status(201).json({
            Success:0,
            message:'Delete Request is running Successfully',
        })
    })

    
});




module.exports=router