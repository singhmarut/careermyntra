/**
 * Created by Marut on 29/06/14.
 */
var mongoose = require('mongoose'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    PaperSchedule = mongoose.model('PaperSchedule'),
    Choice = mongoose.model('Choice'),
    Question = mongoose.model('Question'),
    Section = mongoose.model('Section'),
    server = require('../../server'),
    PassKey = mongoose.model('PassKey');


var _ = require('underscore'),
    http = require('http'),
    angular = require('angular'),
    config = require('../config/config');


exports.saveQuestion = function (req, res, next) {
    var questionToBeSaved = new Question();
    var sanitizedObject =  angular.copy(req.body);
    _.extend(questionToBeSaved, sanitizedObject);

    var id = sanitizedObject._id;
    delete sanitizedObject._id;
    if (id) {
        Question.update({_id: id}, sanitizedObject, {upsert: false}, function (err) {
            if (err){
                console.log(err);
                res.json(500,"Unable to save question " + err);
            }
        });
    }
};

exports.getQuestionsByTag = function (req, res, next) {
    //Get the user email from session
    var userInfo = JSON.parse(req.session.userInfo);
    Question.find().where('accountId').equals(userInfo.email)
        .where('tags').in(['GS']).exec(function(err,data){
            if (!err){
                 res.json(200,data);
            }else{
                 res.json(500,"Unable to find questions for tag");
            }
        });

};