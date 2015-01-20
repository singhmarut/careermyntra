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
