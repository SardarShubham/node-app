const express = require('express');
const bodyParser = require('body-parser');
// importing promotion schema
const promotions = require('../models/promotions');

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get((req, res, next) => {
    promotions.find({})
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Application/json');
        res.json(promotions);
    }, err=>next(err))
    .catch(err => next(err));
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'Application/json');
    res.end("PUT operation is not supported for "+req.url);
})

.post((req, res, next) => {
    promotions.create(req.body)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Application/json');
        res.json(promotion);
    }, err => next(err))
    .catch(err => next(err));
})

.delete((req, res, next) => {
    promotions.remove()
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Application/json');
        res.json(resp);    
    }, err=>next(err))
    .catch(err=>next(err));
});

//promotions router with api end points as promotionId
promotionRouter.route('/:promotionId')
.get((req, res, next) => {
    promotions.findById(req.params.promotionId)
    .then(promotion => {
        // if promotion exists
        if (promotion){
            res.statusCode = 200;
            res.setHeader('Content-type', 'Application/json');
            res.json(promotion);
        }
        // else throw error 
        else{
            err = new Error("promotion with given id not Found");
            err.statusCode = 403;
            return next(err);            
        }
    }, err=>next(err))
    .catch(err=>next(err));
})

.put((req, res, next) => {
    promotions.findByIdAndUpdate(req.params.promotionId, {$set : req.body}, {new:true})
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Applicatin/json');
        res.json(promotion);
    }, err=>next(err))
    .catch(err=>next(err));
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported for promotions/"+req.params.promotionId);
})
.delete((req, res, next) => {
    promotions.findByIdAndRemove(req.params.promotionId)
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Application/json');
        res.json(resp);
    }, err=>next(err))
    .catch(err=>next(err));
});

module.exports = promotionRouter;