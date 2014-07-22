/**
 * Created by wizni on 7/22/14.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user'),
    crypto = require('crypto');


var TagSchema = new Schema({
    name: String
}, { _id: false });

exports.Tags = mongoose.model('Tags', TagSchema);

