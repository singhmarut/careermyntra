var mongoose = require('mongoose'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    MarkSheet = mongoose.model('MarkSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    PaperSchedule = mongoose.model('PaperSchedule'),
    Choice = mongoose.model('Choice'),
    Question = mongoose.model('Question'),
    Section = mongoose.model('Section'),
    SampleAnswerSheet = mongoose.model('SampleAnswerSheet'),
    server = require('../../server'),
    angular = require('angular'),
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
    //If candidate has already appeared for the test

    AnswerSheet.where('emailId').equals(req.session.userInfo.email).where('questionPaperId').equals(req.params.id).exec(function(err,answerSheet){
       if (answerSheet == 'undefined' || answerSheet == null || answerSheet.length == 0){
           QuestionPaper.findById(req.params.id, function(err,questionPaper){
               if (!err){
                   if (!questionPaper){
                       res.json(400, err);
                   }
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
    });
};

exports.getById = function (req, res, next) {
    findById(req,res);
};

exports.getInstruction = function (req, res, next) {
    QuestionPaper.findOne().where('_id').equals(req.params.id).select('instruction').exec(function(err,data){
        if (err) {
            return res.json(500);
        }else{
            return res.json(data.instruction);
        }
    });
};

exports.publishPaper = function (req, res, next) {
    QuestionPaper.findByIdAndUpdate(req.params.id,{state: 'PUBLISHED'},{upsert:false}, function(questionPaper){
        res.json(200);
    });
};
/**
 * Unpublish the paper
 * @param req
 * @param res
 * @param next
 */
exports.unPublishPaper = function (req, res, next) {
    QuestionPaper.findByIdAndUpdate(req.params.id,{state: 'CREATION'},{upsert:false}, function(questionPaper){
        res.json(200);
    });
};

/**
 * Returns the question papers belonging to admin
 * @param req
 * @param res
 * @param next
 */
exports.getQuestionPaperList = function (req, res, next) {
    console.log("Getting papers list");
    //Get all the records belonging to logged in user id
    QuestionPaper.find({'accountId': req.user.email}, function(err,questionPaperRecs){
        if (!err){
            res.json(questionPaperRecs);
        }else{
            console.log("Error while fetching question paper list " + err);
            res.json(400, err);
        }
    });
};

/**
 * Returns the question papers which candidate is elligible to see
 * @param req
 * @param res
 * @param next
 */
exports.getCandidatePapers = function (req, res, next) {
    console.log("Getting papers list");
    //Get all the records for candidate which are in PUBLISHED state
    //TBD: IN Multi-tenant enviornment there has to be a query for which admin accounts user is eligible to see question papers
    QuestionPaper.find().where('state').equals('PUBLISHED').sort('-creationDate').select('id name invitation creationDate accountId description schedules status state').exec(function(err,questionPaperRecs){
        if (!err){
            //We need to set the status of paper to CO which candidate has already been appeared for
            var questionPaperIds = [];
            var completedPapers = [];
            _.each(questionPaperRecs,function(questionPaper){
                questionPaperIds.push(questionPaper.id);
                questionPaper.questions = null;//Avoid transfering this huge
            });
            //Find if any of the paper has been answered already by the candidate or not
            AnswerSheet.find().where('questionPaperId').in(questionPaperIds).select('id questionPaperId name invitation creationDate accountId description schedules status state').exec(function(err,answerSheetRecs){
                _.each(answerSheetRecs,function(answerSheet){
                   var findPaper = _.find(questionPaperRecs,function(questionPaper){
                        return questionPaper.id == answerSheet.questionPaperId;
                    });
                    if (findPaper != null && findPaper != 'undefined'){
                        findPaper.status = answerSheet.status;//Mark this paper as Completed or IP
                    }
                });

                res.json(questionPaperRecs);
            });
        }else{
            console.log("Error while fetching question paper list " + err);
            res.json(400, err);
        }
    });
};

exports.createNewPaper = function (req, res, next) {
    var questionPaperBody = req.body;
    var questionPaper = new QuestionPaper();
    var sanitizedObject = angular.copy(questionPaperBody);
    _.extend(questionPaper,sanitizedObject);
    questionPaper.accountId = req.session.userInfo.email;
    console.log(JSON.stringify(questionPaper));

    QuestionPaper.findOne().where('name').equals(questionPaper.name).exec(function(err,data){
        if (!data || data.length == 0){
            questionPaper.save(function (err,savedPaper){
                if (err){
                    res.json(500,"Unable to create Paper" + err);
                }else{
                    res.json(200,"Successfully created paper");
                }
            });
        }else{
            res.json(409);
        }
    });
};

exports.startScoring = function (req, res, next) {
    try{
        var options = {
            hostname: 'http://localhost',
            //path: '/startGrader/' + req.params.id,
            path: '/',
            port: 8080,
            //since we are listening on a custom port, we need to specify it by hand
            //This is what changes the request to a POST request
            method: 'GET'
        };

        var callback = function(response) {
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                console.log(str);
            });
        }

//        http.get({hostname:'localhost', port:8080, path:'/',method: 'GET', agent:false}, function (res) {
//            // Do stuff
//        })

        var req = http.request({hostname:'localhost', port:8080, path:'/', agent:false}, callback);
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
    }catch(err){
        console.log(err);
    }
//This is the data we are posting, it needs to be a string or a buffer
    res.json(200,"scoring started!");
}

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

exports.getSamplePaperByTag = function (req, res, next) {

    var email = req.session.userInfo.email;
    var userQuota = req.session.user.questionsQuota;
    var paperPromise = SampleAnswerSheet.find().where('emailId').equals(email).where('status').in('IP','CO');
    paperPromise.exec(function(err,data){
        var counter = 0;
        //Go through all quizzes and find out if user has exceeded the quota
        _.each(data,function(paper){
            _.each(paper.sections,function(section){
                counter += section.questions.length;
            });
        });
        //If there is no paper already in progress for this user then only allow him to go further
        if (counter < userQuota){
            var dummyPaper = new SampleAnswerSheet();
            dummyPaper.status = 'IP';
            dummyPaper.emailId = email;
            dummyPaper.name = 'Sample';
            dummyPaper.startDate = new Date();
            dummyPaper.creationDate = new Date();
            dummyPaper.accountId = '';
            var queryPromise =  Question.find();

            //Only published questions are required
            queryPromise = queryPromise.where('tags').all(req.query.tags).where('status').equals('PUBLISHED');
            //TODO: Check Status of questions as well here
            queryPromise = queryPromise.limit(userQuota);
            queryPromise.exec(function(err,data){
                if (!err && data.length > 0){
                    var section = new Section();
                    section.totalTime = userQuota;
                    section.name = req.query.tag;
                    var sections = [];
                    sections.push(section);
                    section.questions = data;
                    dummyPaper.sections.push(section);
                    //Save the sample paper with IP status
                    dummyPaper.save(function(err){
                        if (!err){
                            res.json(200,dummyPaper);
                        }else{
                            res.json(500);
                        }
                    });

                }else{
                    console.log("Unable to find questions for tag");
                    res.json(500,"Unable to find questions for tag");
                }
            });
        }else{
            var paper = data[0];
            //If the quota has exceeded then see if current paper has been in IP Mode and if yes then just give it to the user
            if (paper.status != 'CO' ){
                res.json(200,data[0]);
            }else{
                res.json(400,"You have exceeded your designated quota!!.");
            }
        }
    });

};
//
exports.emitEvent = function (req, res, next) {
    server.emitEvent('login','dum');
};

