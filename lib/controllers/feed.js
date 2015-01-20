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
 * Created by wizni on 8/16/14.
 */
var Feed = require('feed');
var blog = require('./blogController');
var mongoose = require('mongoose'),
    _ = require('underscore'),
    angular = require('angular'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    MarkSheet = mongoose.model('MarkSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    CandidateReport = mongoose.model('CandidateReport'),
    http = require('http'),
    config = require('../config/config'),
    RSS = require('rss'),
    PassKey = mongoose.model('PassKey');

//var feed = new Feed({
//    title:          'Career Myntra Blog',
//    description:    'This is my career myntra feed!',
//    link:           'support@careermyntra.com',
//    image:          'http://example.com/image.png',
//    copyright:      'All rights reserved 2013, Career Myntra',
//
//    author: {
//        name:       'admin',
//        email:      'support@careermyntra.com',
//        link:       'https://careermyntra.com'
//    }
//});


//feed.addCategory('General Studies');



/* lets create an rss feed */
var rssFeed = new RSS({
    title: 'ExamCue',
    description: 'This is a ExamCue Feed',
    feed_url: 'http://localhost:8000/api/blog/posts/:id',
    site_url: 'http://localhost:8000',
    //image_url: 'http://example.com/icon.png',
    //docs: 'http://localhost:8000',
    author: 'ExamCue',
    webMaster: 'ExamCue',
    copyright: 'All rights reserved 2014, ExamCue',
    language: 'en',
    categories: ['UPSC'],
    pubDate: 'May 20, 2012 04:00:00 GMT',
    ttl: '60'
});

/* loop over data and add to feed */
//rssFeed.item({
//    title:  'This is a test feed',
//    description: 'use this for the content. It can include html.',
//    url: 'http://localhost:8000?this&that', // link to the item
//    categories: ['General Studies'], // optional - array of item categories
//    author: 'Administrator', // optional - defaults to feed author property
//    date: 'May 27, 2012' // any format that js Date can parse.
//    //enclosure: {url:'...', file:'path-to-file'} // optional enclosure
//});
exports.getFeed = function (req, res, next) {
// cache the xml to send to clients
    var posts = blog.getAllArticles(false,function(err,posts){
        if (!err){
            for(var key in posts) {
                rssFeed.item({
                    author:             'Administrator',
                    title:              posts[key].title,
                    url:                'https://exacmcue.in/api/blog/posts/' + posts[key]._id,
                    description:        posts[key].description,
                    categories:         posts[key].tags, // optional - array of item categories
                    date:               new Date()
                });
            };

            var  xml= rssFeed.xml();
            res.set('Content-Type', 'text/xml');
            res.send(xml);
        }
    });
//    var post = new Object();
//    post.title = 'test';
//    post.url = 'test';
//    post.description ='test';

}
