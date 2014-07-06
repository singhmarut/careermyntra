var parseXlsx = require('excel');

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
    config = require('../config/config');

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
               question.accountId = JSON.parse(req.session.userInfo).email;
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
