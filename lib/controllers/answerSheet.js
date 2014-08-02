var mongoose = require('mongoose'),
    _ = require('underscore'),
    angular = require('angular'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    MarkSheet = mongoose.model('MarkSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    CandidateReport = mongoose.model('CandidateReport'),
    http = require('http'),
    config = require('../config/config'),
    PassKey = mongoose.model('PassKey');

/**
 * Saves answersheet
 */
exports.create = function (req, res, next) {
        var answerSheet = req.body;
        answerSheet.questionPaperId = answerSheet._id; //Preserve the original question Paper Id. It will be used to find to which question paper this belongs
        answerSheet._id = null;//ID will be coming from UI because of Question Paper
        var userAnswerSheet = new AnswerSheet();
        var sanitizedObject = angular.copy(answerSheet);
        //userAnswerSheet =
        _.extend(userAnswerSheet, sanitizedObject);
        userAnswerSheet.status = 'CO';//Mark paper as completed
        userAnswerSheet.creationDate = new Date();
        //Store emailId of the user
        userAnswerSheet.emailId = req.session.userInfo.email;

        //If question paper was by invitation only then we need to expire the pass key
        if (userAnswerSheet.invitation == 'BY_INVITATION'){
            userAnswerSheet.passKey = req.session.passKey;
            //Expire the passkey
            PassKey.findOneAndUpdate({ 'passKey': userAnswerSheet.passKey},{'status': 'CO'},function(err){
                if (err){
                    console.error('Unable to expire Key', err);
                }
            });
        }

        userAnswerSheet.save();
        res.json(200);
};

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