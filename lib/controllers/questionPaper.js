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

//var io = require('socket.io')(80);

/**
 * Create user
 */
exports.getByAuthKey = function (req, res, next) {
    var passKey = req.params.authKey;
    //ToDO: Before loading we need to check the schedules
    //PassKey which have already completed can not restart
    var query = PassKey.findOne({ 'passKey': passKey}).where('status').in(['NS', 'IP']).limit(1);

    query.exec(function(err,passKeyRec){
       if (!err){
           if (passKeyRec){
               QuestionPaper.findById(passKeyRec.questionPaperId, function(err,questionPaper){
                   if (questionPaper){
                       passKeyRec.update({'status': 'IP','startTime': new Date()},function(err){
                           if (!err){
                               req.session.passKey = passKeyRec.passKey;
                               return res.json(200, {'questionPaperId': questionPaper.id});
                           }else{
                               console.log(err);
                               return res.json(503, "Unable to start test..Please try again");
                           }
                       });
                   }
               });
           } else{
               return res.json(400, "Wrong authentication Key");
           }
       }
    });
};

function findById(req, res){
    QuestionPaper.findById(req.params.id, function(err,questionPaper){
        if (!err){
            var sectionCount = 0;
            _.each(questionPaper.sections,function(section){
                var questionCount = 0;
                _.each(section.questionIds,function(questionId){
                    Question.findById(questionId,function(err,question){
                        section.questions.push(question);
                        questionCount++;
                        if (questionCount == section.questionIds.length){
                            sectionCount++;
                        }
                        if (questionPaper.sections.length == sectionCount){
                            res.json(questionPaper);
                        }
                    });
                });

            });
        }else{
            res.json(400, err);
        }
    });
}
exports.getById = function (req, res, next) {
    findById(req,res);
}
exports.getQuestionPaperList = function (req, res, next) {
    console.log("Getting papers list");
    //Get all the records belonging to logged in user id
    QuestionPaper.find({'accountId': req.user.email}, function(err,questionPaperRecs){
        if (!err){
            res.json(questionPaperRecs);
        }else{
            if (questionPaperRecs.length == 0){

                var paperJson =  {
                    'sections':  [ {'name': 'section1', 'timeRemaining': 30, 'questions': [
                        {'type': 'MCQ','content': '<b>Dummy Question 1-Section1</b>','choices': [{'choice':'Option1','isUserAnswer': false, 'id':1},{'choice':'Option2','isUserAnswer': false, 'id':2},{'choice':'Option3','isUserAnswer': false, 'id':3},{'choice':'Option4','isUserAnswer': false, 'id':4}]}
                        ,{'type': 'MCQ','content': 'Dummy Question 2-Section1','choices': [{'choice':'Option1','isUserAnswer': false, 'id':1},{'choice':'Option2','isUserAnswer': false, 'id':2},{'choice':'Option3','isUserAnswer': false, 'id':3},{'choice':'Option4','isUserAnswer': false, 'id':4}]}
                        ,{'type': 'MCQ','content': 'Dummy Question 3-Section1','choices': [{'choice':'Option1','isUserAnswer': false, 'id':1},{'choice':'Option2','isUserAnswer': false, 'id':2},{'choice':'Option3','isUserAnswer': false, 'id':3},{'choice':'Option4','isUserAnswer': false, 'id':4}]}
                        ]
                        }
                    ]};
            }
            console.log("Error while fetching question paper list " + err);
            res.json(400, err);
        }
    });
};


exports.createDummyPaper = function (req, res, next) {
    var paper = new QuestionPaper();
    var section = new Section();
    section.name= "Section1";
    section.instructions = "Complete the section";
    section.totalTime = 30;
    section.passKey.push("dummy");
    var questionPaper = new QuestionPaper();
    questionPaper.name = "Physics";
    questionPaper.description = "Physics Paper";
    questionPaper.accountId = req.user.email;
    questionPaper.sections.push(section);
    //TODO: Need to add schedules and check if current time is OK as per schedule
    questionPaper.save(function (err,savedPaper){
        if (!err){
            for ( var i = 0; i < 10; i++){
                createDummyQuestions(i,savedPaper,req.user.email);
            }
        }
    });

};

exports.startScoring = function (req, res, next) {

    var options = {
        hostname: config.graderBaseUrl + 'startGrader/' + req.id,
        path: '/',
        //since we are listening on a custom port, we need to specify it by hand
        //This is what changes the request to a POST request
        method: 'POST'
    };

    var req = http.request(options, function(err){

    });
//This is the data we are posting, it needs to be a string or a buffer
    req.write("scoring started!");
    req.end();
}

createDummyQuestions = function (i,questionPaper,emailId) {

    var question = new Question();
    question.type='MCQ';
    question.content = 'Dummy Content' + i.toString();
    question.difficulty = 1;
    question.marks = 5;
    question.accountId = emailId;
    question.tags = [].push('GS');
    for (var j = 0; j < 4; j++){
        var choice = new Choice();
        choice.idx = j+1;
        choice.choice = "Choice" + (j+1).toString();
        if (j==3){
            choice.isCorrectAnswer = true;
        }
        question.choices.push(choice);
    }

    question.save(function(err,savedQuestion){
        if (err){
            console.log(err);
        }else{
            var section =  questionPaper.sections[0];
            /*QuestionPaper.findByIdAndUpdate(
                questionPaper.id,
                {$push: {"messages": {title: title, msg: msg}}},
                {safe: true, upsert: true},
                function(err, model) {
                    console.log(err);
                }
            );*/

            section.questionIds.push(savedQuestion.id.toString());
            if (section.questionIds.length == 10){
                section.passKey.push("dummy2");
                questionPaper.sections[0].totalTime = 60;
                questionPaper.markModified('sections');
                questionPaper.save();
            }
        }
    });
};


exports.addSchedule = function (req, res, next) {
    //Get all the records belonging to logged in user id
    QuestionPaper.findById(req.params._id, function(err,questionPaper){
        if (err){
            res.json(400, err);
        }else{
            var paperSchedule = new PaperSchedule();
            paperSchedule = angular.copy(req.body);
            var findSchedule = _.find(questionPaper.schedules,function(paperSchedule){return paperSchedule.name == req.body.name;});
            if (!findSchedule){
                questionPaper.schedules.push(paperSchedule);
                res.json("Success");
            }else{
                res.json(400,"Duplicate Schedule not allowed!");
            }
        }
    });
};
//
exports.emitEvent = function (req, res, next) {
    server.emitEvent('login','dum');
};

