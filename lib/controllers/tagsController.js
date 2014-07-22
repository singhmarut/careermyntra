var mongoose = require('mongoose'),
    Question = mongoose.model('Question'),
    Tags = mongoose.model('Tags'),
    PassKey = mongoose.model('PassKey');


var _ = require('underscore'),
    http = require('http'),
    config = require('../config/config');


/**
 * Login
 */
exports.addNewTag = function (req, res, next) {
    Tags.findOneAndUpdate({ 'name': req.body.tag},{'name': req.body.tag},{upsert:true},function(err){
        if (err){
            console.error('Unable to add tag', err);
            res.json(500);
        }else{
            res.json(200);
        }
    });
};

exports.renameTag = function (req, res, next) {
    Tags.findOneAndUpdate({ 'name': req.body.oldName},{'name': req.body.newName},{upsert:false},function(err){
        if (err){
            console.error('Unable to expire Key', err);
            res.json(500);
        }else{
            res.json(200);
        }
    });
};


exports.getAll = function (req, res, next) {
    Tags.find({},function(err,data){
        if (err){
            console.error('Unable to expire Key', err);
            res.json(500);
        }else{
            res.json(200,data);
        }
    });
};