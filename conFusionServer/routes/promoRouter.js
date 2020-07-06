//express is required here as every new file becomes its own node module
const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next(); //this will start looking for next middleware functions that match /promotions end point and the modified req and res parameters are passed ahead
})
.get((req,res,next) => {
    res.end('Will Send all the promotions to you!');
})
.post((req,res,next)=>{
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /promotions');
})
.delete((req,res,next) => {
    res.end('Deleting all the promotions!');
});

promoRouter.route('/:promoId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next(); //this will start looking for next middleware functions that match /promotions/:promoId end point and the modified req and res parameters are passed ahead
})
.get((req,res,next) => {
    res.end('Will Send details of the promotion: '+req.params.promoId +'to you!');
})
.post((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('POST operation not supported on /promotions/'+req.params.promoId);
})
.put((req,res,next)=>{
    res.write('Updating the promotion: '+req.params.promoId+'\n');
    res.end('Will update the promotion: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next) => {
    res.end('Deleting promotion: '+req.params.promoId);
});

module.exports = promoRouter; //exporting to use in index.js