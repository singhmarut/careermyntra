/*
 * Copyright (c) 2015. All rights reserved.
 *
 *   This file is created and owned by careermyntra. software licensed to you under enterprise Software License Agreement (the "License")
 *   You may not use this file except in compliance with the License. For licensing contact: support@careermyntra.com
 *
 *   Unauthorized reverse engineering, disassembly or modifications prohibited.
 *   CareerMyntra Confidential
 */

var mongoose = require('mongoose'),
    _ = require('underscore'),
    angular = require('angular'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    SampleAnswerSheet = mongoose.model('SampleAnswerSheet'),
    MarkSheet = mongoose.model('MarkSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    CandidateReport = mongoose.model('CandidateReport'),
    http = require('http'),
    request = require('request'),
    config = require('../config/config'),
    moment = require('moment'),
    momentTZ = require('moment-timezone'),
    PassKey = mongoose.model('PassKey');

var redis = require("redis"),
    redisClient = redis.createClient();

/**
 * Saves answersheet
 */
exports.create = function (req, res, next) {
    var answerSheet = req.body;
    //answerSheet.questionPaperId = answerSheet._id; //Preserve the original question Paper Id. It will be used to find to which question paper this belongs
    //answerSheet._id = null;//ID will be coming from UI because of Question Paper

    var userAnswerSheet = {};
    var recId;
    if (req.query.samplePaper){
        userAnswerSheet   = new SampleAnswerSheet();
        recId = userAnswerSheet._id;
    }else{
        userAnswerSheet   = new AnswerSheet();
        recId = userAnswerSheet._id;
    }

    var sanitizedObject = angular.copy(answerSheet);
    sanitizedObject._id = recId;
    //userAnswerSheet =
    _.extend(userAnswerSheet, sanitizedObject);
    userAnswerSheet.status = 'CO';//Mark paper as completed
    userAnswerSheet.creationDate = momentTZ.tz(moment(), "Asia/Calcutta");
    //Store emailId of the user
    userAnswerSheet.emailId = req.session.userInfo.email;

    //If question paper was by invitation only then we need to expire the pass key
//        if (userAnswerSheet.invitation == 'BY_INVITATION'){
//            userAnswerSheet.passKey = req.session.passKey;
//            //Expire the passkey
//            PassKey.findOneAndUpdate({ 'passKey': userAnswerSheet.passKey},{'status': 'CO'},function(err){
//                if (err){
//                    console.error('Unable to expire Key', err);
//                }
//            });
//        }

    userAnswerSheet.save(function(err,data){
        if (!err){
            startScoring(data._id);
            res.json(200,data);
        }else{
            res.json(500);
        }
    });

};

exports.attachEmailWithSampleAnswerSheet = function (req, res, next) {

    SampleAnswerSheet.findByIdAndUpdate(req.params.id,{'emailId': req.body.email},{upsert: false},function(err,data){
        res.json(200);
    });

};

function startScoring(answerSheetId){

    redisClient.publish("examcue.answerSheet", answerSheetId);

//    var url = config.graderBaseUrl + '/grader/start' + "?answerSheetId=" + answerSheetId;
//    var dummyData = {};
//    request.post({url:url}, function optionalCallback(err, httpResponse, body) {
//        if (err) {
//            return console.error('upload failed:', err);
//        }
//        console.log('Upload successful!  Server responded with:', body);
//    });
}

exports.getAnswerSheets = function (req, res, next) {

    var email = req.session.userInfo.email;
    var passKey = req.params.passKey;
    var url = config.graderBaseUrl + 'candidate/email/' + email + '/report/passKey/' + passKey;
    console.log(url);
    CandidateReport.findOne({'passKey': passKey},function (err, candidateReport) {
        //make magic happen
        return res.json(200,candidateReport);
    });
};

/**
 *
 * @param email
 * @param res
 * @param next
 */
exports.getCandidateMarkSheetsForAdmin = function (req, res, next) {

    var email = req.params.email;
    this.getCandidateMarkSheets(email,res,next);
};

/**
 * For security purpose we get email from session for now
 * @param email
 * @param res
 * @param next
 */
exports.getCandidateMarkSheetsForAdmin = function (req, res, next) {
    var email = req.session.userInfo.email;
    this.getCandidateMarkSheets(email,res,next);
};

exports.saveComment = function (req, res, next) {
    var adminEmail = req.session.userInfo.email;
    var answerSheetId = req.params.id;
    var questionId = req.params.questionId;
    AnswerSheet.findById(answerSheetId).exec(function(err,answerSheet){
        if (err){
            console.error('Unable to find asnwersheets', err);
            return res.json(500);
        }else{
            var question =_.find(answerSheet.sections[0].questions,function(question){
                return question._id == questionId;
            });
            //Update the comment in Answer Sheet
            question.comment = req.body.comment;
            answerSheet.save(function(err){
                return res.json(200);
            });
        }
    });
};



/**
 * returns all the marksheets till date for a particular paper for admin to use
 * @param email
 * @param res
 * @param next
 */
exports.getMarkSheetsByPaper = function (req, res, next) {
    var adminEmail = req.session.userInfo.email;
    var paperId = req.params.id;
    MarkSheet.where('accountId').equals(adminEmail).where('questionPaperId').select('id questionPaperId emailId name invitation startDate creationDate accountId description schedules status state').equals(paperId).exec(function(err,data){
        if (err){
            console.error('Unable to find asnwersheets', err);
            return res.json(500);
        }else{
            return res.json(200,data);
        }
    });
};

/**
 * TBD: Only open_for_all marksheets
 * @param req
 * @param res
 * @param next
 */
exports.getCandidateMarkSheets = function (email, res, next) {
    MarkSheet.where('email').equals(email).where('status').equals('CO').exec(function(err,data){
        if (err){
            console.error('Unable to find asnwersheets', err);
            return res.json(500);
        }else{
            var passKeyCount = data.length;
            var traversePassKeyCount = 0;
            var answerSheets = [];
            var passKeyArr = [];
            return res.json(200,data);
        }
    });
};

exports.getCandidateAnswerSheets = function (req, res, next) {

    var email = req.session.userInfo.email;
    AnswerSheet.find().where('emailId').equals(email).exec(function (err, records) {
        if (err) {
            return res.json(500,records);
        }
        else {
            return res.json(200,records);
        }
    });
};

exports.getCandidateAnswerSheetByPaperId = function (req, res, next) {

    //Get the user email from session
    var email = req.session.userInfo.email;
    AnswerSheet.findOne().where('emailId').equals(email).where('questionPaperId').equals(req.params.id).exec(function (err, records) {
        if (err) {
            return res.json(500,records);
        }
        else {
            return res.json(200,records);
        }
    });
};