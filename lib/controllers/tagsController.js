var mongoose = require('mongoose'),
    Question = mongoose.model('Question'),
    Tags = mongoose.model('Tags'),
    question = require('./questionController'),
    PassKey = mongoose.model('PassKey');


var _ = require('underscore'),
    http = require('http'),
    config = require('../config/config');


/**
 * Login
 */
exports.addNewTag = function (req, res, next) {
    var tags = req.body.tag.split(",");
    _.each(tags,function(tag){
        Tags.findOneAndUpdate({ 'name': tag},{'name': tag},{upsert:true},function(err){
            if (err){
                console.error('Unable to add tag', err);
                res.json(500);
            }else{
                res.json(200);
            }
        });
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

exports.replaceTag = function (req, res, next) {
    Tags.findOneAndUpdate({ 'name': new RegExp(req.body.toBeReplaced, "i")},{'name': req.body.newName},{upsert:false},function(err){
        if (err){
            console.error('Unable to expire Key', err);
            res.json(500);
        }else{
            res.json(200);
        }
    });
};

exports.getAll = function (req, res, next) {
    var countList = [];
    var dataList = [];
    Tags.find({},function(err,data){
        _.each(data,function(tag){
            var tags = [];
            tags.push(tag.name);
            var queryPromise =  Question.find().where('tags').in(tags).count();
            queryPromise.exec(function(err,count){
                if (!err){
                    dataList.push({name: tag.name,qCount: count});
                    if (dataList.length == data.length){
                        res.json(200,dataList);
                    }
                }else{
                    res.json(500);
                }
            });

        });
        if (err){
            console.error('Unable to expire Key', err);
            res.json(500);
        }
    });
};