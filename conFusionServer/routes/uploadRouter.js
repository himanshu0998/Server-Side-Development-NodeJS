const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
var cors = require('./cors');
//customizing multer

//defining a storage engine
var storage = multer.diskStorage({
    destination: (req, file,cb)=>{
        cb(null,'public/images'); //call back function(cb) 2 parameters: error, destination
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

//defining a File Filter to see if file is an image
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage:storage, fileFilter: imageFileFilter}); //configuring a multer module with the parameters

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{
    res.sendStatus = 200;
}) //preflight requests first send options and then the request
.get(cors.cors,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => { //upload.Single parameter => form field name
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;