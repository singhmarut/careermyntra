'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    eventEmitter = require('events'),
    busboy = require('connect-busboy'),
    mongoose = require('mongoose');

/**
 * Main application file
 */
console.log(process.argv[3]);
// Set default node environment to development
process.env.NODE_ENV = process.argv[2];

var config = require('./lib/config/config');
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

//var Poet = require('poet');
//
//var poet = Poet(app, {
//    posts: './_posts/',
//    postsPerPage: 5,
//    metaFormat: 'json'
//});
//
//poet.addTemplate({
//    ext: 'ejs',
//    fn : function (options) { return require('ejs').eval(options.source); }
//}).init();

//CORS middleware
//var allowCrossDomain = function(req, res, next) {
//    res.header('Access-Control-Allow-Credentials', true);
//    var allowedOrigins = ['localhost:8000','careermyntra.com'];
//    if (process.env.NODE_ENV == 'production' && (allowedOrigins.indexOf('req.headers.origin') != -1)){
//        res.header('Access-Control-Allow-Origin', req.headers.origin)
//        //res.header('Access-Control-Allow-Origin', '*');
//        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//        res.header('Access-Control-Allow-Headers', 'Content-Type');
//    }
//    //res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
//
//    next();
//}

//app.use(busboy);

//app.use(function(req, res) {
//    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
//        var myFile = file;
//
//    });
//    req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
//        // ...
//    });
//    // etc ...
//});

require('./lib/config/express')(app);
require('./lib/routes')(app);

// Start server
//var server = app.listen(config.port, config.ip, function () {
//  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
//});

var http = require('http');
var server = http.Server(app);

//var server = express.createServer();

//server.get('/',function(req,res){
//    res.sendfile('index.html');
//});

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
