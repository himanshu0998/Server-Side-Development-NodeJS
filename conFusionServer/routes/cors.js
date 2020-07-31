const express = require('express');
const cors = require('cors');

const app = express();

const whitelist = ["https://localhost:3443","http://localhost:3000"];

var corsOptionsDelegate = (req, callback)=>{
    var corsOptions;
    console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin'))!==-1)
    {
        corsOptions = {origin: true}; // client side would be informed that it is okay to accept requests from the origin
    }
    else {
        corsOptions = {origin: false};
    }
    callback(null,corsOptions);
};  

exports.cors  = cors();  // allowed for all the origins..mostly for GET requests
exports.corsWithOptions = cors(corsOptionsDelegate); // allowed only for specific origins