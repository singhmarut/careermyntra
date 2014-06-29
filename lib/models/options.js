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