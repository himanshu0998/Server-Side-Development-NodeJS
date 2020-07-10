//express is required here as every new file becomes its own node module
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /promotions end point and the modified req and res parameters are passed ahead
// })
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions)=>{
        // console.log(promotions);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })
})
.post((req,res,next)=>{
    Promotions.create(req.body)
    .then((promotion)=>{
        console.log('Promotion Added: ',promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})
.put((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /promotions');
})
.delete((req,res,next) => {
    Promotions.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => {
        next(err); //passes the error to the overall error handler of the appplication
    })
    .catch((err) => {
        next(err);
    });
});

promoRouter.route('/:promoId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /promotions/:promoId end point and the modified req and res parameters are passed ahead
// })
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.post((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('POST operation not supported on /promotions/'+req.params.promoId);
})
.put((req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set:req.body
    },{new:true})
    .then((promotion)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})
.delete((req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
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

module.exports = promoRouter; //exporting to use in index.js