var mongoose = require('mongoose'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    PassKey = mongoose.model('PassKey');

var _ = require('underscore'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto');


function sendEmail(email,subject,text){
    var mailOpts, smtpConfig;
    smtpConfig = nodemailer.createTransport('SMTP', {
        service: 'Gmail',
        auth: {
            user: "support@careermyntra.com",
            pass: "career123#"
        }
    });

    mailOpts = {
        from: 'CareerMyntra',
        to: email,
//replace it with id you want to send multiple must be separated by ,(comma)
        subject: subject,
        text: text
    };

    try{
        smtpConfig.sendMail(mailOpts, function (error, response) {
            if (error) {
                console.log("Email send Falied");
            }
            else {
                console.log("Email sent successfully");
            }
        });
    }catch(err){
        console.log("Unable to send email for passKey");
    }
};

exports.sendEmail = function(email,subject,text){
    sendEmail(email,subject,text);
};

exports.registerForNewsLetterEmail = function(req, res, next){
    sendEmail('support@careermyntra.com','NewsLetter',req.body.email);
};

exports.sendFeedbackEmail = function(req, res, next){
    var text = req.body.email + '<>' + req.body.content;
    sendEmail('support@careermyntra.com','NewsLetter',text);
};