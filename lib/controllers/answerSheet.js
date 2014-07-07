var mongoose = require('mongoose'),
    _ = require('underscore'),
    angular = require('angular'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    CandidateReport = mongoose.model('CandidateReport'),
    http = require('http'),
    config = require('../config/config')
    PassKey = mongoose.model('PassKey');

/**
 * Saves answersheet
 */
exports.create = function (req, res, next) {
    if (req.session.passKey){
        var answerSheet = req.body;
        answerSheet.questionPaperId = answerSheet._id; //Preserve the original question Paper Id
        answerSheet._id = null;//ID will be coming from UI because of Question Paper
        var userAnswerSheet = new AnswerSheet();
        var sanitizedObject = angular.copy(answerSheet);
        //userAnswerSheet =
        _.extend(userAnswerSheet, sanitizedObject);
        userAnswerSheet.status = 'CO';//Mark paper as completed
        userAnswerSheet.passKey = req.session.passKey;
        userAnswerSheet.creationDate = new Date();
        //If question paper was by invitation only then we need to expire the pass key
        if (userAnswerSheet.invitation == 'BY_INVITATION'){
            //Expire the passkey
            PassKey.findOneAndUpdate({ 'passKey': userAnswerSheet.passKey},{'status': 'CO'},function(err){
                if (err){
                    console.error('Unable to expire Key', err);
                }
            });
        }
        userAnswerSheet.save();
    }
};

exports.getAnswerSheets = function (req, res, next) {

    var email = req.user.userInfo.email;
    var passKey = req.params.passKey;
    var url = config.graderBaseUrl + 'candidate/email/' + email + '/report/passKey/' + passKey;
    console.log(url);
    CandidateReport.findOne({'passKey': passKey},function (err, candidateReport) {
        //make magic happen
        return res.json(200,candidateReport);
    });

//    http.get(url,  function(incomingResponse) {
//        console.log("Got response: " + incomingResponse.statusCode);
//        res.json(200);
//    }).on('error', function(err) {
//        res.json(400,err);
//        console.log("Got error: " + err.message);
//    });
};

exports.getCandidateAnswerSheets = function (req, res, next) {

    var email = req.user.userInfo.email;
    PassKey.find({ 'email': email,'status': 'CO'},function(err,data){
        if (err){
            console.error('Unable to expire Key', err);
        }else{
            var passKeyCount = data.length;
            var traversePassKeyCount = 0;
            var answerSheets = [];
            var passKeyArr = [];
            _.each(data,function(key){
                console.log(key.passKey);
                passKeyArr.push(key.passKey);
            });

            AnswerSheet.find().where('passKey').in(passKeyArr).exec(function (err, records) {
                //make magic happen
                return res.json(200,records);
            });

//            _.each(data,function(passKey){
//                AnswerSheet.findOne({'passKey': passKey.passKey},function(err,data) {
//                    traversePassKeyCount++;
//                    if (err){
//                        return res.json(400, err);
//                    }else{
//                        if (data){
//                            answerSheets.push(data);
//                        }
//                        if ((passKeyCount == traversePassKeyCount)){
//                            return res.json(200,answerSheets);
//                        }
//                    }
//                });
//            });
        }
    });
};
