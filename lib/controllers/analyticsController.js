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
 * Created by Marut on 9/4/14.
 */

var mongoose = require('mongoose'),
    _ = require('underscore'),
    angular = require('angular'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    MarkSheet = mongoose.model('MarkSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    Question = mongoose.model('Question'),
    http = require('http'),
    config = require('../config/config'),
    PassKey = mongoose.model('PassKey');

exports.getQuestionStats = function(years, prefix,topics) {
    //Sort in ascending order
    _.sortBy(years, function(year){ return year; });

    _.each(years, function(year){
        var tagName = prefix + " " + year //UPSC 2008
        var topicQuestionCountMap = {};
        var tagVisited = 0;
        //Get All Questions for a particular topic from UPSC 2008
        Question.find().where('tags').in([tagName]).exec(function (err, questions) {
            //make magic happen
            var questionCount = questions.length;
            tagVisited++;
            _.each(questions,function(question){
                _.each(question.tags,function(tag){
                    if (_.contains(topics,tag)){
                        topicQuestionCountMap[tag] = questionCount;
                    }
                });
            });
        });

        return topicQuestionCountMap;
    });

//    Question.findOne({tags: new RegExp('^'+name+'$', "i")}, function(err, doc) {
//        //Do your action here..
//    });
}

/**
 * Returns the question count for tags which are all present in given topics..While returning it removes these topics and returns only extra tags other than tags
 * provided
 * @param years
 * @param prefix
 * @param topics
 */
function getQuestionStatsWithSubTags(years, prefix,topics) {
    //Sort in ascending order
    _.sortBy(years, function(year){ return year; });

    _.each(years, function(year){
        var tagName = prefix + " " + year //UPSC 2008
        var topicQuestionCountMap = {};
        var tagVisited = 0;
        //Get All Questions for a particular topic from UPSC 2008
        Question.find().where('tags').all(topics).exec(function (err, questions) {
            //make magic happen
            var questionCount = questions.length;
            tagVisited++;
            _.each(questions,function(question){
                var desiredTags = [];
                //Remove all tags which
                _.each(question.tags,function(tag){
                        topicQuestionCountMap[tag] = questionCount;
                });
            });
        });

        return topicQuestionCountMap;
    });

//    Question.findOne({tags: new RegExp('^'+name+'$', "i")}, function(err, doc) {
//        //Do your action here..
//    });
}

function getQuestionCountPerYear(){

}