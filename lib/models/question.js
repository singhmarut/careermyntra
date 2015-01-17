'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user'),
    crypto = require('crypto');

var questionTypes = 'MCQ MCA FITB VIDEO AUDIO'.split(' ');
var paperStatus = 'NS IP CO'.split(' ');
var paperState = 'PUBLISHED CREATION'.split(' ');
var invitation = 'OPEN_FOR_ALL BY_INVITATION'.split(' ');
var questionState = 'DRAFT PUBLISHED'.split(' ');
var quality = 'OK UNCLEAR'.split(' ');

/**
 * User Schema
 */

var ScoringStrategy = new Schema({
    passingMarks: Number
});

var ChoiceSchema = new Schema({
    idx: Number,
    choice: String,
    isCorrectAnswer: {
        type: Boolean,
        default: false
    },
    isUserAnswer: {
        type: Boolean,
        default: false
    }
},{_id: false});

var MatchingOptionSchema = new Schema({
    isHeader: {
        type: Boolean,
        default: false
    },
    option: String,
    match: String
},{_id: false});

var QuestionSchema = new Schema({
    type: { type: String, enum: questionTypes },
    content: String,
    choices: [ChoiceSchema],
    matchingOptions: [MatchingOptionSchema],
    status: { type: String, enum: questionState,default:'DRAFT'},
    quality: { type: String, enum: quality,default:'OK'},
    extraContent: String,
    creationDate: { type: Date, default: Date.now },
    tags: [String],
    answer: String,
    accountId : String,   //Email ID of the company which owns the question
    comment: String, //Comment Entered by user for each question
    //answers: [String], //Corrected Answers to questions //In case of FITB it has to be a String...In case of
    //selectedAnswers: [String], //Selected Answers (By users) to questions..Not required since it has been taken care in ChoiceSchema
    answered: Boolean, //Indicates if a question has been answered by candidate or not
    //candidateResponse: [String],//At the time of creating question all candidate responses will be null
    difficulty: {type: Number, default: 1,min: 1, max: 10},
    marks: {type: Number, default: 1,min: 1, max: 100}
});

var SectionSchema = new Schema({
    name: String,
    instruction: String,
    totalTime: Number,  //Max time allowed for a particular section (in minutes)
    timeRemaining: Number, //Time of Section //This will be populated when user submits the paper
    isOver: Boolean, //Tells if a particular section is completed or not
    questions : [QuestionSchema],  //Questions which belong to this section
    questionIds: [String]
}, {
    _id: false
});

var Question  = mongoose.model('Question', QuestionSchema);

var QuestionBank = new Schema({
    accountId: String, //Email id of the user who owns it
    name: [String],
    questions : [String]//Object ID of the question belonging to this bank
});

var QuestionPaperSchema = new Schema({
    name: { type: String},         //Unique name of the question Paper..., index: { unique: true }
    invitation: { type: String, enum: invitation },
    startDate: { type: Date,required: false},
    creationDate: { type: Date, default: Date.now },   //In case of paper creation date when question paper was set...In case of answer sheet when it was submitted by candidate
    accountId : String,   //Email ID of the company which owns this paper
    questionPaperId: String,//In case of anwersheet this will be set to questionPaperId to which this answerSheet belongs
    emailId: String, //EmailId of the user...it will be populated when user subscribes for the test
    description: String,  //Description of Question Paper
    instruction: String,
    category: [String],   //Category of the question Paper namely Polity,Quiz,GEO,GS
    sections : [SectionSchema], //No need to reference since section is never going to be reused
    schedules : [PaperScheduleSchema],
    status: {type:String,enum: paperStatus, default: 'NS'}, //Defines if the paper has been started by candidate or not
    state: {type: String,enum: paperState, default: 'CREATION'},
    marks: {type: Number, default: 0}
});

var PaperScheduleSchema = new Schema({
    name: { type: String, index: { unique: true }}, //Unique name of the schedule
    description: String, //Details about schedule
    startTime: Date,  //Start time when test can be taken
    endTime: Date,   //End time after which test can't be taken
    timeZone: String //TimeZone of the schedule,
});

var PaperStatusSchema = new Schema({
    passKey: String, //Unique Pass key
    startTime: Date, //Start Time of paper
    endTime: Date,
    status: {type: paperStatus, default: 'NS'}
});

//Map between passKey and Question
var PassKeySchema = new Schema({
    passKey: { type: String, index: { unique: true }}, //Unique Pass key
    generatedTime: Date,
    startTime: Date, //Start Time of paper i.e. when passKey was accessed
    endTime: Date,  //Time when test has been finished
    status: {type: String,enum:paperStatus, default: 'NS'},
    email: String,//Email id of the user who has been assigned this passkey
    scheduleId : String, //Schedule ObjectId in which this pass Key is valid
    questionPaperId : String //Id of question paper for which this passKey has been generated...
});

var CandidateReportSchema = new Schema({
    email: String,
    passKey: {type:String, indexed:true,unique:true},
    finalReport: String
});



exports.QuestionPaper = mongoose.model('QuestionPaper', QuestionPaperSchema);
exports.AnswerSheet = mongoose.model('AnswerSheet', QuestionPaperSchema);
exports.SampleAnswerSheet = mongoose.model('SampleAnswerSheet', QuestionPaperSchema);

exports.MarkSheet = mongoose.model('MarkSheet', QuestionPaperSchema);
exports.PassKey = mongoose.model('PassKey', PassKeySchema);
exports.PaperSchedule = mongoose.model('PaperSchedule', PaperScheduleSchema);
exports.PaperStatus = mongoose.model('PaperStatus', PaperStatusSchema);
exports.Question = mongoose.model('Question', QuestionSchema);
exports.Choice = mongoose.model('Choice', ChoiceSchema);
exports.Section = mongoose.model('Section', SectionSchema);
exports.CandidateReport = mongoose.model('CandidateReport', CandidateReportSchema);


