//express is required here as every new file becomes its own node module
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');  //to interact with mongodb server
const Dishes = require('../models/dishes'); //useful while processing REST Calls


const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /dishes end point and the modified req and res parameters are passed ahead
// })
.get((req,res,next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);  //res.json() puts the response in the body and sends to the client
    }, (err) => {
        next(err); //passes the error to the overall error handler of the appplication
    })
    .catch((err) => {
        next(err);
    });
})
.post((req,res,next)=>{
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Dish Created: ',dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);  //res.json() puts the response in the body and sends to the client
    }, (err) => {
        next(err); //passes the error to the overall error handler of the appplication
    })
    .catch((err) => {
        next(err);
    });
})
.put((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next) => {
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);  //res.json() puts the response in the body and sends to the client
    })
});

dishRouter.route('/:dishId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /dishes end point and the modified req and res parameters are passed ahead
// })
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.post((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
})
.put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    }, {new : true})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.delete((req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
});

module.exports = dishRouter; //exporting to use in index.js