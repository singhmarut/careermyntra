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
    search = require('./search'),
    config = require('../config/config');

var parseXlsx = require('excel');


exports.updateQuestion = function (req, res, next) {
    var questionToBeSaved = new Question();
    var sanitizedObject =  angular.copy(req.body);

    //sanitizedObject = _.pairs(sanitizedObject);
    var id = sanitizedObject._id;
    delete sanitizedObject._id;

    if (id) {
        Question.findById(id, function (err, question) {
            if (err){
                console.log(err);
                res.json(500,"Unable to save question " + err);
            }else{

                _.extend(questionToBeSaved._doc ,sanitizedObject);
                _.each(_.keys(sanitizedObject),function(key){
                    var propValue = _.property(key)(sanitizedObject);
                    question.set(key,propValue);
                });
                //angular.extend(question.toObject(), sanitizedObject);

//                Question.findByIdAndUpdate(id,questionToBeSaved,function (err){
//                    if (err){
//                        console.log(err);
//                        res.json(500,"Unable to save question " + err);
//                    }else{
//                        res.json(200);
//                    }
//                });
                    question.save(function (err) {
                    if (err){
                        console.log(err);
                        res.json(500,"Unable to save question " + err);
                    }else{
                        var questions = [];
                        questions.push(question);
                        search.buildQuestionIndex(questions);
                        res.json(200);
                    }
                });
            }
        });
    }
};

exports.getQuestionsById = function (req, res, next) {
    Question.findById(req.params.id,function(err,data){
        if (!err){
            res.json(200,data);
        }else{
            res.json(500,data);
        }
    });
};

exports.searchQuestions = function (req, res, next) {
    //Get the user email from session
    var userInfo = req.session.userInfo;
    var tags = [];
    if (angular.isArray(req.query.tag)){
        tags = req.query.tag;
    }else{
        tags.push(req.query.tag);
    }

    if (req.query.text){
        search.searchQuestions(req.query.text,function(hits){
            res.json(200,hits);
        });
    }
    else{
        var queryPromise =  Question.find();
        if (userInfo.email.localeCompare('ankur@careermyntra.com') != 0){
            queryPromise = queryPromise.where('accountId').equals(userInfo.email);
        }

        queryPromise = queryPromise.where('tags').all(tags);

        if (req.query.startDate){
            queryPromise = queryPromise.where('creationDate').gt(req.query.startDate);
        }
        if (req.query.endDate){
            queryPromise = queryPromise.where('creationDate').lt(req.query.endDate);
        }
        if (req.query.status){
            queryPromise = queryPromise.where('status').in(req.query.status.split(','));
        }
        queryPromise.exec(function(err,data){
            if (!err){
                res.json(200,data);
            }else{
                console.log("Unable to find questions for tag");
                res.json(500,"Unable to find questions for tag");
            }
        });
    }

};

exports.getSamplePaperByTag = function (req, res, next) {

    var dummyPaper = new QuestionPaper();
    dummyPaper.name = 'Sample';
    dummyPaper.startDate = new Date();
    dummyPaper.creationDate = new Date();
    dummyPaper.accountId = '';
    dummyPaper.emailId = '';
    var queryPromise =  Question.find();

    queryPromise = queryPromise.where('tags').all(req.query.tags);
    //TODO: Check Status of questions as well here
    queryPromise = queryPromise.limit(15);
    queryPromise.exec(function(err,data){
        if (!err){
            var section = new Section();
            section.totalTime = 15;
            section.name = req.query.tag;
            var sections = [];
            sections.push(section);
            section.questions = data;
            dummyPaper.sections.push(section);
            res.json(200,dummyPaper);
//            dummyPaper.save(function(err){
//                if (!err){
//                    res.json(200,dummyPaper);
//                }else{
//                    res.json(500);
//                }
//            });

        }else{
            console.log("Unable to find questions for tag");
            res.json(500,"Unable to find questions for tag");
        }
    });

};

/**
 * For creating a summary report per user
 * @param req
 * @param res
 * @param next
 */
exports.getQuestionsCountByUser = function (userId) {
    //Get the user email from session
    var queryPromise =  Question.find().where('accountId').equals(userId).count().exec();
    return queryPromise;
};


exports.addExtraTags = function (req, res, next) {
    var queryPromise =  Question.find();

    if (req.query.exactMatch != 'undefined' && req.query.exactMatch == "false"){
        queryPromise = queryPromise.where('tags').in(req.body.searchTags);
    }else{
        //Find questions with given tag
        queryPromise = queryPromise.where('tags').all(req.body.searchTags);
    }
    var givenTag = req.params.tag;
    var extraTags = req.body.tags;
    queryPromise.exec(function(err,data){
        if (!err){
            var questions = [];
            _.each(data,function(question){
                _.each(extraTags,function(tag){
                    if (!_.contains(question.tags,tag)){
                        question.tags.push(tag); //Just add the new tags one by one
                    }
                });
                question.save();
                questions.push(question);

            });
            search.buildQuestionIndex(questions);
            res.json(200,questions);

        }else{
            console.log("Unable to find questions for tag");
            res.json(500,"Unable to find questions for tag");
        }
    });
};


exports.uploadQuestions = function (req, res, next) {
    parseXlsx(req.files.file.path, function(err, data) {
        if(err) {
            return res.json(500,"Unable to upload questions " + err);
        }
        else{
            var headers = data[0];//First row will always be header
            var idx;
            for (idx = 1; idx < data.length; idx++){
                var question = new Question();
                question.accountId = req.session.userInfo.email;
                var propIdx = 0;
                var choiceIdx = 0;
                _.each(data[idx],function(property){
                    var headerName = headers[propIdx];
                    if (headerName == 'Content'){
                        question.content = property;
                    }else if (headerName.indexOf('Choice') != -1){
                        var choice = new Choice();
                        choice.idx = choiceIdx;
                        choice.choice = property;
                        choice.isCorrectAnswer = false;
                        var choiceIndex = parseInt(headerName.substring(6));
                        question.choices.push(choice);
                        choiceIdx++;
                    }else if (headerName.indexOf('Answer') != -1){
                        var answerIndex = parseInt(headerName.substring(6));
                        var choice = question.choices[answerIndex-1];
                        if (property.toString() == '1'){
                            choice.isCorrectAnswer = true;
                        }
                    }else if (headers[propIdx] === 'Answer'){
                        question.answer = property;
                    }else if (headers[propIdx] == 'Tags'){
                        question.tags = property;
                    }else if (headers[propIdx] == 'Type'){
                        question.type = property;
                    }


                    propIdx++;
                });

                question.type = 'MCQ';//Hard Coded for now
                question.save(function(err){
                    if (err){
                        console.log('Unable to save question' + idx);
                    }
                });
            }
        }
    });
};

exports.addQuestion = function (req, res, next) {
    var question = new Question(req.body);
    question.accountId = req.session.userInfo.email;
    question.save(function(err){
        if (err){
            res.json(500);
        }else{
            var questions = [];
            questions.push(question);
            search.buildQuestionIndex(questions);
            res.json(200);
        }
    });
};

exports.refreshQuestionIndex = function (req, res, next) {
    Question.find().exec(function(err,data){
        if (!err){
            search.buildQuestionIndex(data);
            res.json(200);
        }else{
            console.log("Error while refreshing blog index " + err);
            res.json(400, err);
        }
    });
};