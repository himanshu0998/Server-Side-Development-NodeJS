//express is required here as every new file becomes its own node module
const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next(); //this will start looking for next middleware functions that match /leaders end point and the modified req and res parameters are passed ahead
})
.get((req,res,next) => {
    res.end('Will Send all the leaders to you!');
})
.post((req,res,next)=>{
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /leaders');
})
.delete((req,res,next) => {
    res.end('Deleting all the leaders!');
});

leaderRouter.route('/:leaderId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    next(); //this will start looking for next middleware functions that match /leaders/:leaderId end point and the modified req and res parameters are passed ahead
})
.get((req,res,next) => {
    res.end('Will Send details of the leader: '+req.params.leaderId +'to you!');
})
.post((req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('POST operation not supported on /leaders/'+req.params.leaderId);
})
.put((req,res,next)=>{
    res.write('Updating the leader: '+req.params.leaderId+'\n');
    res.end('Will update the leader: '+req.body.name+' with details: '+req.body.description);
})
.delete((req,res,next) => {
    res.end('Deleting leader: '+req.params.leaderId);
});

module.exports = leaderRouter; //exporting to use in index.js