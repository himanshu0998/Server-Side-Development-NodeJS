//express is required here as every new file becomes its own node module
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');  //to interact with mongodb server
const Dishes = require('../models/dishes'); //useful while processing REST Calls
const authenticate = require('../authenticate');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /dishes end point and the modified req and res parameters are passed ahead
// })
.get((req,res,next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);  //res.json() puts the response in the body and sends to the client
    }, (err) => {
        next(err); //passes the error to the overall error handler of the appplication
    })
    .catch((err) => {
        next(err);
    });
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Dishes.create(req.body) //create request to add new info
    .then((dish)=>{
        console.log('Dish Created: ',dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);  //res.json() puts the response in the body and sends to the client
    }, (err) => {
        next(err); //passes the error to the overall error handler of the appplication
    })
    .catch((err) => {
        next(err);
    });
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser,(req,res,next) => {
    Dishes.remove({})
    .then((resp)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);  //res.json() puts the response in the body and sends to the client
    },(err) => {
        next(err); //passes the error to the overall error handler of the appplication
    })
    .catch((err) => {
        next(err);
    });
});

dishRouter.route('/:dishId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /dishes end point and the modified req and res parameters are passed ahead
// })
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set: req.body
    }, {new : true})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => {
        next(err);
    })
    .catch((err) => {
        next(err);
    });
})
.delete(authenticate.verifyUser,(req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
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

//HANDLING COMMENTS end points

dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish!=null){
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);  //res.json() puts the response in the body and sends to the client
        }
        else{
            err = new Error('Dish '+req.params.dishId+' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err); //passes the error to the overall error handler of the appplication
    })
    .catch((err) => {
        next(err);
    });
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null){
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            }, (err) => {
                next(err); //passes the error to the overall error handler of the appplication
            })
        }
        else{
            err = new Error('Dish '+req.params.dishId+' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => {
        next(err); //passes the error to the overall error handler of the appplication
    })
    .catch((err) => {
        next(err);
    });
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /dishes/'+req.params.dishId+'/comments');
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter; //exporting to use in index.js