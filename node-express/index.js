const express = require('express');
const http = require('http');

const hostname = "localhost";
const port = 3000;

const app = express();  // our application is using express node module

app.use((req, res, next) => {
    //next is an optional parameter of the function
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
});

const server =http.createServer(app);
server.listen(port,hostname, ()=>{
    console.log(`Server running at http://${hostname}:${port}`);  
});