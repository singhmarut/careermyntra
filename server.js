'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    eventEmitter = require('events'),
    mongoose = require('mongoose');

/**
 * Main application file
 */
console.log(process.env.PORT);
// Set default node environment to development
process.env.NODE_ENV = process.argv[2] || 'development';

var config = require('./lib/config/config');

console.log('mongo URI is : ' + config.mongo.uri);

var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Passport Configuration
var passport = require('./lib/config/passport');

// Setup Express
var app = express();

require('./lib/config/express')(app);
require('./lib/routes')(app);

var http = require('http');
var server = http.Server(app);


app.get('/', function(req, res){
    res.sendfile('index.html');
});

server.listen(config.port,function(){
    console.log('listening on1 *:'+config.port);
});

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});
//
//exports.emitEvent = function(topic,data){
//   // io.emit(topic,data);
//};

// Expose app
//exports = module.exports = app;
//exports.serverIO = io;


// Catch all to prevent exceptions from crashing the app
//process.on('uncaughtException', function (exception) {
//    console.error(exception);
//});
