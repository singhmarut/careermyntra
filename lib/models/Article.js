/**
 * Created by Marut on 13/07/14.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user'),
    crypto = require('crypto');

var commentStatus = 'PENDING ACCEPTED'.split(' ');
var postStatus = 'DRAFT PUBLISHED'.split(' ');

/**
 * User Schema
 */

var CommentsSchema = new Schema({
    text: {type: String, indexed: true},
    createdAt: {type: Date, default: Date.now()},
    emailId: String,
    status: { type: String, enum: commentStatus, default: 'PENDING'},
    comments: [CommentsSchema]      //Required for threaded Comments
});

var ArticleSchema = new Schema({
    title: {type: String,unique:true, indexed: true},
    accountId: String, //EmailId of the account who has created this article
    content: String,
    tags: [String],
    status: { type: String, enum: postStatus, default: 'DRAFT'},
    publishedAt: {type: Date},
    createdAt: {type: Date, default: Date.now()},
    comments: [CommentsSchema]
});

var SubscriptionSchema = new Schema({
    email: {type: String,unique:true, indexed: true},
    subscriptions: [String]
});

exports.Comments = mongoose.model('Comments', CommentsSchema);
exports.Article = mongoose.model('Article', ArticleSchema);
exports.Subscription = mongoose.model('Subscription', SubscriptionSchema);


