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
 * Created by Marut on 20/06/14.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user'),
    crypto = require('crypto');

var questionTypes = 'MCQ MCA FITB VIDEO AUDIO'.split(' ');
var paperStatus = 'NS,IP,CO'.split(',');
/**
 * User Schema
 */

var OptionsSchema = new Schema({
    extraFields: [String]
});