//express is required here as every new file becomes its own node module
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const mongoose = require('mongoose');  //to interact with mongodb server
const Dishes = require('../models/dishes'); //useful while processing REST Calls
const authenticate = require('../authenticate');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions, (req,res)=>{
    res.sendStatus = 200;
}) //preflight requests first send options and then the request
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /dishes end point and the modified req and res parameters are passed ahead
// })
.get(cors.cors,(req,res,next) => {
    Dishes.find({})
    .populate('comments.author') //populating author's field in the comment subschema of the Dish schema
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
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
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
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
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
.options(cors.corsWithOptions, (req,res)=>{
    res.sendStatus = 200;
}) //preflight requests first send options and then the request
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type','text/plain');
//     next(); //this will start looking for next middleware functions that match /dishes end point and the modified req and res parameters are passed ahead
// })
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author') //populating author's field in the comment subschema of the Dish schema of a particular dish
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
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('POST operation not supported on /dishes/'+req.params.dishId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
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
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next) => {
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
.options(cors.corsWithOptions, (req,res)=>{
    res.sendStatus = 200;
}) //preflight requests first send options and then the request
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author') //populating author's field in the comment subschema of the Dish schema
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
.post(cors.corsWithOptions,authenticate.verifyUser,(req,res,next)=>{ // after verify user, user is loaded into req.user which can be further used
    Dishes.findById(req.params.dishId)
    .then((dish)=>{
        if(dish!=null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then(()=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                })
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
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403; //operation not supported
    res.end('PUT operation not supported on /dishes/'+req.params.dishId+'/comments');
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
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
.options(cors.corsWithOptions, (req,res)=>{
    res.sendStatus = 200;
}) //preflight requests first send options and then the request
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishId)
    .populate('comments.author') //populating author's field in the comment subschema of the Dish schema
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
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {  //checking if comment is present
            if(req.user._id.equals(dish.comments.id(req.params.commentId).author._id))
            {
                if (req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment;                
                }
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then(()=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })                
                }, (err) => next(err));
            }
            else
            {
                var err = new Error("You are not authorized to perform this operation!");
                err.status = 403;
                return next(err);
            }
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
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if(req.user._id.equals(dish.comments.id(req.params.commentId).author._id))
            {
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then((dish) => {
                    Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then(()=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })                 
                }, (err) => next(err));
            }
            else
            {
                var err = new Error("You are not authorized to perform this operation!");
                err.status = 403;
                return next(err);
            }
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