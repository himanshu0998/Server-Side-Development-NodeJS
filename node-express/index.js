const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const dishRouter = require('./routes/dishRouter'); //path specified as it is a file based node module

const hostname = "localhost";
const port = 3000;

const app = express();  // our application is using express node module

app.use(morgan('dev'));

app.use(bodyparser.json()); //the body of the request is placed in body attribute of req parameter

app.use('/dishes', dishRouter); //Mounting /dishes endpoint to dishRouter Module

//Building RestAPIs using express functions
//app.all => it is executed first by default for the /dishes endpoint
//Using express router, hence moved to another dishRouter.js 

// app.get('/dishes/:dishId',(req,res,next) => {
//     res.end('Will Send details of the dish: '+req.params.dishId +'to you!');
// });

// app.post('/dishes/:dishId',(req,res,next)=>{
//     res.statusCode = 403; //operation not supported
//     res.end('POST operation not supported on /dishes/'+req.params.dishId);
// });

// app.put('/dishes/:dishId',(req,res,next)=>{
//     res.write('Updating the dish: '+req.params.dishId+'\n');
//     res.end('Will update the dish: '+req.body.name+' with details: '+req.body.description);
// });

// app.delete('/dishes/:dishId',(req,res,next) => {
//     res.end('Deleting dish: '+req.params.dishId);
// });

app.use(express.static(__dirname+'/public'));

app.use((req, res, next) => {
    //next is an optional parameter of the function
    // console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
});

const server =http.createServer(app);
server.listen(port,hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}`);  
});