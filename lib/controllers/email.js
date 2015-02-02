/*
 * Copyright (c) 2015. All rights reserved.
 *
 *   This file is created and owned by careermyntra. software licensed to you under enterprise Software License Agreement (the "License")
 *   You may not use this file except in compliance with the License. For licensing contact: support@careermyntra.com
 *
 *   Unauthorized reverse engineering, disassembly or modifications prohibited.
 *   CareerMyntra Confidential
 */

var mongoose = require('mongoose'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    PassKey = mongoose.model('PassKey');

var _ = require('underscore'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto');

var sendgrid  = require('sendgrid')('singh.marut', 'deewana420');

//smtpConfig = nodemailer.createTransport('SMTP', {
//    service: 'Gmail',
//    auth: {
//        user: "support@careermyntra.com",
//        pass: "career123#"
//    }
//});

function sendEmail(email,subject,text){
    var mailOpts, smtpConfig;

//    mailOpts = {
//        from: 'ExamCue',
//        to: email,
////replace it with id you want to send multiple must be separated by ,(comma)
//        subject: subject,
//        text: text
//    };
//
//    try{
//        smtpConfig.sendMail(mailOpts, function (error, response) {
//            if (error) {
//                console.log("Email send Falied");
//            }
//            else {
//                console.log("Email sent successfully");
//            }
//        });
//    }catch(err){
//        console.log("Unable to send email for passKey");
//    }


    //var template  = Handlebars.compile(data);
    //var html    = template({url: url});
    sendgrid.send({
        to:       email,
        from:     'ExamCue',
        subject:  subject,
        text: text
    }, function(err, json) {
        if (err) { return console.error(err); }
        console.log(json);
    });
};

exports.sendEmail = function(email,subject,text){
    sendEmail(email,subject,text);
};

exports.registerForNewsLetterEmail = function(req, res, next){
    sendEmail('support@careermyntra.com','NewsLetter',req.body.email);
    return res.json(200);
};

exports.sendFeedbackEmail = function(req, res, next){
    var text = req.body.email + '<br/>' + req.body.feedback;
    sendEmail('support@careermyntra.com','NewsLetter',text);
    return res.json(200);
};