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
    //userAnswerSheet =
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

    //TODO: Need to add schedules and check if current time is OK as per schedule
//    questionToBeSaved.save(function (err,savedQuestion){
//        if (err){
//            console.log(err);
//            res.json(500,"Unable to save question " + err);
//        }else{
//            res.json(200);
//        }
//    });
};