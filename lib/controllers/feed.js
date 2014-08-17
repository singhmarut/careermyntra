/**
 * Created by wizni on 8/16/14.
 */
var Feed = require('feed');
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

var feed = new Feed({
    title:          'Career Myntra Blog',
    description:    'This is my career myntra feed!',
    link:           'support@careermyntra.com',
    image:          'http://example.com/image.png',
    copyright:      'All rights reserved 2013, Career Myntra',

    author: {
        name:       'admin',
        email:      'support@careermyntra.com',
        link:       'https://careermyntra.com'
    }
});


feed.addCategory('Technologie');


exports.get = function (req, res, next) {
    var posts = {};
    var post = new Object();
    post.title = 'test';
    post.url = 'test';
    post.description ='test';
    posts['Dummy post'] = post;
    for(var key in posts) {
        feed.addItem({
            title:          posts[key].title,
            link:           posts[key].url,
            description:    posts[key].description,
            author: [
                {
                    name:   'Jane Doe',
                    email:  'janedoe@example.com',
                    link:   'https://example.com/janedoe'
                },
                {
                    name:   'Joe Smith',
                    email:  'joesmith@example.com',
                    link:   'https://example.com/joesmith'
                }
            ],
            contributor: [
                {
                    name:   'Shawn Kemp',
                    email:  'shawnkemp@example.com',
                    link:   'https://example.com/shawnkemp'
                },
                {
                    name:   'Reggie Miller',
                    email:  'reggiemiller@example.com',
                    link:   'https://example.com/reggiemiller'
                }
            ],
            date:           new Date()
            //image:          posts[key].image
        });
    }

    feed.render('rss-2.0');
};


/* lets create an rss feed */
var rssFeed = new RSS({
    title: 'title',
    description: 'description',
    feed_url: 'http://localhost:8000/api/blog/feed',
    site_url: 'http://localhost:8000',
    //image_url: 'http://example.com/icon.png',
    docs: 'http://localhost:8000',
    author: 'Dylan Greene',
    managingEditor: 'Dylan Greene',
    webMaster: 'Dylan Greene',
    copyright: '2013 Dylan Greene',
    language: 'en',
    categories: ['Category 1','Category 2','Category 3'],
    pubDate: 'May 20, 2012 04:00:00 GMT',
    ttl: '60'
});

/* loop over data and add to feed */
rssFeed.item({
    title:  'item title',
    description: 'use this for the content. It can include html.',
    url: 'http://localhost:8000?this&that', // link to the item
    categories: ['Category 1','Category 2','Category 3','Category 4'], // optional - array of item categories
    author: 'Guest Author', // optional - defaults to feed author property
    date: 'May 27, 2012', // any format that js Date can parse.
    lat: 33.417974, //optional latitude field for GeoRSS
    long: -111.933231 //optional longitude field for GeoRSS
    //enclosure: {url:'...', file:'path-to-file'} // optional enclosure
});
exports.getFeed = function (req, res, next) {
// cache the xml to send to clients
    var  xml= rssFeed.xml();
    res.set('Content-Type', 'text/xml');
    res.send(xml);
}
