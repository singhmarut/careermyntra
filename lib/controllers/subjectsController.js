var mongoose = require('mongoose'),
    search = require('./search'),
    questionController= require('./questionController'),
    questionPaper= require('./questionPaperController'),
    PaperStatus = mongoose.model('PaperStatus'),
    Comments = mongoose.model('Comments'),
    Article = mongoose.model('Article'),
    Subscription = mongoose.model('Subscription'),
    PassKey = mongoose.model('PassKey');

var moment = require('moment-timezone');
var _ = require('underscore');
var parseXlsx = require('excel');


var mainMap = {};

var subjectMap = {};
subjectMap['Main']= ['Polity','Economy','WGeography','IGeography','History','Environment','Science'];

subjectMap['Polity'] = ['Salient Features of Constituion','Preamble','Union and Territories','Citizenship','Fundamental Rights',
    'DPSP and FD',
    'President and Vice President','Council of Ministers, CAG and AG','Parliament','Judiciary','State Government','Panchayats',
    'Fifth Schedule and Sixth Schedule','Union and State Relations','Services and Tribunals','Elections',
    'Emergency','Constitution Amendments','Polity Miscellaneous','Public Policy','Social Issues and Rights'];

subjectMap['Papers'] = ['UPSC1995','UPSC1996','UPSC1997','UPSC1998','UPSC1999','UPSC2000','UPSC2001','UPSC2002','UPSC2003','UPSC2004','UPSC2005',
    'UPSC2006','UPSC2007','UPSC2008','UPSC2009','UPSC2010','UPSC2011','UPSC2012'];


subjectMap['Economy'] = ['Basics','Planning','Public Finance','Money Markets','RBI','Monetary Policy and Fiscal Policy',
    'Prices and Inflation','Balance of Payments','International Trade','Industry','Services','Agriculture','Energy, ' +
        'Infrastrucuture and Communications','Sustainable Development and Climate Change','Human Development',
        'Economy Miscellaneous'];

exports.getTopics = function (req, res, next) {
    if (req.params.subject){
        res.json(200,subjectMap[req.params.subject]);
    }
};

exports.getMainTopics = function (req, res, next) {
    if (_.isString(req.params.subject)){
        res.json(200,subjectMap[req.params.subject]);
    }
};

exports.createBulkPapersFromTags = function (req, res, next) {
    var papers = req.body.papers;
    var count = 0;
    _.forEach(papers,function(paper){
        var tags = [];
        tags.push(paper);
        questionController.findByAllTags(tags,function(err,data){
            var paperName = paper;
            var categories = ['UPSCPapers'];
            questionPaper.createSamplePaperForTag(paperName,categories, req.session.userInfo.email,paper,data,function(err,data){
                if (err){
                    console.log("error while creating Paper.." + err);
                }
                count++;
            });
        });
    })

    if (count == papers.length){
        res.json(200);
    }
};

exports.createBulkQuizFromPapers = function (req, res, next) {

    var sliceSize = 20;

    var subjects = req.body.subjects;
    var papers = req.body.papers;
    _.forEach(subjects,function(subject){
        var papersCount = papers.length;
        //For one main topic when all papers have been iterated then start creating quiz for main topic
        var idx =1;
        var questions = [];
        _.forEach(papers,function(paper){
            var tags = [];
            tags.push(subject);
            tags.push(paper);
            questionController.findByAllTags(tags,function(err,data){
                questions = questions.concat(data);
                papersCount--;

                if (papersCount == 0){
                    var i = 1;
                    //Shuffle the questions to distribute
                    questions = _.shuffle(questions);
                    var counter = Math.ceil(questions.length / sliceSize);
                    var questionCounter = 0;
                    for (var i = 0 ; i < counter; i++){
                        var finalQuestions = [];
                        var j = i*sliceSize ;
                        for (;  j < (i+1)*sliceSize && questionCounter < questions.length ; j++){
                            finalQuestions.push(questions[j]);
                            questionCounter++;
                        }
                        var paperName = subject + " Quiz " + idx;
                        idx++;
                        var categories = ['Quizzes'];
                        categories = categories.push(subject);
                        questionPaper.createSamplePaperForTag(paperName,categories, req.session.userInfo.email,subject,finalQuestions,function(err,data){
                            if (err){
                                console.log("error while creating quiz.." + err);
                            }
                        });
                        //Loop complete ..create a quiz now
                    };
                }
            });
        });
    });
};

exports.subjects = subjectMap;




