/*
 * Copyright (c) 2015. All rights reserved.
 *
 *   This file is created and owned by careermyntra. software licensed to you under enterprise Software License Agreement (the "License")
 *   You may not use this file except in compliance with the License. For licensing contact: support@careermyntra.com
 *
 *   Unauthorized reverse engineering, disassembly or modifications prohibited.
 *   CareerMyntra Confidential
 */

/**
 * Created by Marut on 11/06/14.
 */
var mongoose = require('mongoose'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    users = require('./controllers/users'),
    PassKey = mongoose.model('PassKey');


exports.getQuestionPaperList = function (req, res, next) {
    QuestionPaper.find({}, function(err,questionPaperRecs){
        if (!err){
            res.json(questionPaperRecs);
        }else{
            console.log("Error while fetching question paper list " + err);
            res.json(400, err);
        }
    });
};

