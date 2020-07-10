//express is required here as every new file becomes its own node module
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /leaders end point and the modified req and res parameters are passed ahead
// })
.get((req,res,next) => {
    Leaders.find({})
    .then((leaders)=>{
        // console.log(leaders);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    })
})
.post((req,res,next)=>{
    Leaders.create(req.body)
    .then((leader)=>{
        console.log('Leader Added: ',leader);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})
.put((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /leaders');
})
.delete((req,res,next) => {
    Leaders.remove({})
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

leaderRouter.route('/:leaderId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /leaders/:leaderId end point and the modified req and res parameters are passed ahead
// })
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.post((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('POST operation not supported on /leaders/'+req.params.leaderId);
})
.put((req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set:req.body
    },{new:true})
    .then((leader)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err)=>{
        next(err);
    })
    .catch((err)=>{
        next(err);
    });
})
.delete((req,res,next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
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

module.exports = leaderRouter; //exporting to use in index.js