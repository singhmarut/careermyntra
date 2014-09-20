var mongoose = require('mongoose'),
    async = require('async'),
    Question = mongoose.model('Question'),
    Tags = mongoose.model('Tags'),
    question = require('./questionController'),
    PassKey = mongoose.model('PassKey');


var _ = require('underscore'),
    http = require('http'),
    config = require('../config/config');

var elasticsearch = require('elasticsearch');

// Connect to localhost:9200 and use the default settings
var client = new elasticsearch.Client();

exports.buildPostIndex = function (posts) {

    async.each(posts, function( post, callback) {
        client.index({
            index: 'posts',
            id: post._id.toString(),
            type: 'post',
            body: post
        });
        callback();
    }, function(err){
        // if any of the saves produced an error, err would equal that error
        if (!err){
            client.indices.refresh({index: 'posts'});
        }
    });
};

exports.buildQuestionIndex = function (questions) {

    async.each(questions, function( question, callback) {
        client.index({
            index: 'questions',
            id: question._id.toString(),
            type: 'question',
            body: question
        });
        callback();
    }, function(err){
        // if any of the saves produced an error, err would equal that error
        if (!err){
            client.indices.refresh({index: 'questions'});
        }
    });
};

exports.indexPosts = function (post) {
    client.index({
        index: 'posts',
        id: post._id.toString(),
        type: 'post',
        body: post
    }, function (err, resp) {
        if (!err){
            client.indices.refresh({index: 'posts'});
            console.log(resp);
        }
    });
};

exports.searchPosts = function(searchStr,callback){
    client.search({
        index: 'posts',
        body: {
            query: {
                "multi_match" : {
                    "query":      searchStr,
                    "fields":     [ "status", "content" ]
                }
//                match: {
//                    status: 'PUBLISHED'
//                    //content: 'test'
//                }
            }
        }
    }).then(function (body) {
            var hits = body.hits.hits;
            console.log('results: '+ hits.length);
            var posts = [];
            _.each(hits,function(result){
                posts.push(result._source);
            });
            callback(posts)
        }, function (error) {
            console.trace(error.message);
        });
};


exports.searchQuestions = function(searchStr,callback){
    client.search({
        index: 'questions',
        body: {
            query: {
                "multi_match" : {
                    "query":      searchStr,
                    "fields":     [ "content", "extraContent" ]
                }
            }
        }
    }).then(function (body) {
            var hits = body.hits.hits;
            var questions = [];
            _.each(hits,function(result){
                questions.push(result._source);
            });
            callback(questions)
        }, function (error) {
            console.trace(error.message);
        });
};