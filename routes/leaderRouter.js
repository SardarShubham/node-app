const express = require('express');
const bodyParser = require('body-parser');
// importing leader schema
const leaders = require('../models/leaders');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req, res, next) => {
    leaders.find({})
    .then(leaders => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Application/json');
        res.json(leaders);
    }, err=>next(err))
    .catch(err => next(err));
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-type', 'Application/json');
    res.end("PUT operation is not supported for "+req.url);
})

.post((req, res, next) => {
    leaders.create(req.body)
    .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Application/json');
        res.json(leader);
    }, err => next(err))
    .catch(err => next(err));
})

.delete((req, res, next) => {
    leaders.remove()
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Application/json');
        res.json(resp);    
    }, err=>next(err))
    .catch(err=>next(err));
});

//Leaders router with api end points as leaderId
leaderRouter.route('/:leaderId')
.get((req, res, next) => {
    leaders.findById(req.params.leaderId)
    .then(leader => {
        // if leader exists
        if (leader){
            res.statusCode = 200;
            res.setHeader('Content-type', 'Application/json');
            res.json(leader);
        }
        // else throw error 
        else{
            err = new Error("Leader with given id not Found");
            err.statusCode = 403;
            return next(err);            
        }
    }, err=>next(err))
    .catch(err=>next(err));
})

.put((req, res, next) => {
    leaders.findByIdAndUpdate(req.params.leaderId, {$set : req.body}, {new:true})
    .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Applicatin/json');
        res.json(leader);
    }, err=>next(err))
    .catch(err=>next(err));
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported for leaders/"+req.params.leaderId);
})
.delete((req, res, next) => {
    leaders.findByIdAndRemove(req.params.leaderId)
    .then(resp => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'Application/json');
        res.json(resp);
    }, err=>next(err))
    .catch(err=>next(err));
});

module.exports = leaderRouter;