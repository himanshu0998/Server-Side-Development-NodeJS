const http = require('http');
const hostname  = 'localhost';
const port = 3000;

const server = http.createServer((req,res)=> {
    console.log(req.headers);

    //setting up a response 'res' parameter
    //After res.end() the response is sent back to the client
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body>Hello, World!</body></html>')
});

server.listen(port,hostname, ()=> {
    //back quotes are used when u need to include variables in the string with $ before them 
    // third parameter of listen is a function
    console.log(`Server running at http://${hostname}:${port}`)
})