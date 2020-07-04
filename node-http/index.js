const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname  = 'localhost';
const port = 3000;

const server = http.createServer((req,res)=> {
    // console.log(req.headers);
    console.log('Request for ' + req.url + ' by method ' + req.method);
    
    //use of path and fs
    if(req.method=='GET')
    {
        var fileURL;
        if(req.url=='/') fileURL = '/index.html';
        else fileURL = req.url;

        var filePath = path.resolve('./public'+fileURL);
        const fileExt = path.extname(filePath);
        if(fileExt=='.html')
        {
            fs.exists(filePath, (exists) => {
                if(!exists){
                    res.statusCode = 404;
                    res.setHeader('Content-Type','text/html');
                    res.end('<html><body><h1>Error 404! File Not Found</h1></body></html>');
                    return;
                }
                res.statusCode = 200;
                res.setHeader('Content-Type','text/html');
                fs.createReadStream(filePath).pipe(res); // Conerts the file into a byte streamm and pipes in the body of response
            })
        }
        else
        {
            res.statusCode = 404;
            res.setHeader('Content-Type','text/html');
            res.end('<html><body><h1>Error 404!'+fileURL+' is not an HTML File</h1></body></html>');
            return;
        }
    }
    else
    {
        res.statusCode = 404;
        res.setHeader('Content-Type','text/html');
        res.end('<html><body><h1>Error 404!'+req.method+' not supported</h1></body></html>');
        return;
    }
    
    //setting up a response 'res' parameter
    //After res.end() the response is sent back to the client
    // res.statusCode = 200;
    // res.setHeader('Content-Type','text/html');
    // res.end('<html><body>Hello, World!</body></html>')
});

server.listen(port,hostname, ()=> {
    //back quotes are used when u need to include variables in the string with $ before them 
    // third parameter of listen is a function
    console.log(`Server running at http://${hostname}:${port}`)
})