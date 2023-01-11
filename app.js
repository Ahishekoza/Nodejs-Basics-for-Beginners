const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')


const productApi =  require('./Api/Routes/product.js')
const orderApi = require('./Api/Routes/order.js')
const userApi = require('./Api/Routes/user.js')

mongoose.connect('mongodb+srv://Abhishek:RzWCiDSpqqhOXKRD@cluster0.wvueacp.mongodb.net/?retryWrites=true&w=majority')

// Use to see the requests 
app.use(morgan('dev'))

// Static is use to make folders public
app.use('/uploads',express.static('uploads'))
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json())


// Routes which handles request
app.use('/products',productApi)
app.use('/orders', orderApi)
app.use('/user',userApi)

// Error Handling
app.use((req,res,next)=>{
    const error = "Component Not Found"
    res.status(500).json({
        success:1,
        error:error
    })
})


app.listen(3006,()=>{
    console.log('App is Successfully Running on port No. 3006')
})