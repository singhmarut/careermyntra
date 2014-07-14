/**
 * Created by Marut on 13/07/14.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user'),
    crypto = require('crypto');

var commentStatus = 'PENDING ACCEPTED'.split(' ');

/**
 * User Schema
 */

var CommentsSchema = new Schema({
    text: {type: String, unique: true, indexed: true},
    createdAt: {type: Date, default: Date.now()},
    emailId: String,
    status: { type: String, enum: commentStatus, default: 'PENDING'},
    comments: [CommentsSchema]      //Required for threaded Comments
});

var ArticleSchema = new Schema({
    title: String,
    accountId: String, //EmailId of the account who has created this article
    text: String,
    tags: [String],
    createdAt: {type: Date, default: Date.now()},
    comments: [CommentsSchema]
});

