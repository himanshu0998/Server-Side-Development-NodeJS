//express is required here as every new file becomes its own node module
const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next(); //this will start looking for next middleware functions that match /dishes end point and the modified req and res parameters are passed ahead
})
.get((req,res,next) => {
    res.end('Will Send all the dishes to you!');
})
.post((req,res,next)=>{
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /dishes');
})
.delete((req,res,next) => {
    res.end('Deleting all the dishes to you!');
});

dishRouter.route('/:dishId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next(); //this will start looking for next middleware functions that match /dishes end point and the modified req and res parameters are passed ahead
})
.get((req,res,next) => {
    res.end('Will Send details of the dish: '+req.params.dishId +'to you!');
})
.post((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
})
.put((req,res,next)=>{
    res.write('Updating the dish: '+req.params.dishId+'\n');
    res.end('Will update the dish: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next) => {
    res.end('Deleting dish: '+req.params.dishId);
});

module.exports = dishRouter; //exporting to use in index.js