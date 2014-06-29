/**
 * Created by Marut on 29/06/14.
 */


'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    nodemailer = require('nodemailer'),
    User = require('./user');

/**
 * User Schema
 */

var FeedbackSchema = new Schema({
    creationDate: Date,
    email: String,
    name: String,
    content: String
});

var NewsLetterSchema = new Schema({
    creationDate: Date,
    email: String
});

exports.Feedback = mongoose.model('Feedback', FeedbackSchema);
exports.NewsLetter = mongoose.model('NewsLetter', NewsLetterSchema);
