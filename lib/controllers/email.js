var mongoose = require('mongoose'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    PassKey = mongoose.model('PassKey');

var _ = require('underscore'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto');

smtpConfig = nodemailer.createTransport('SMTP', {
    service: 'Gmail',
    auth: {
        user: "support@careermyntra.com",
        pass: "career123#"
    }
});

function sendEmail(email,subject,text){
    var mailOpts, smtpConfig;

    mailOpts = {
        from: 'ExamCue',
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
    return res.json(200);
};

exports.sendFeedbackEmail = function(req, res, next){
    var text = req.body.email + '<br/>' + req.body.feedback;
    sendEmail('support@careermyntra.com','NewsLetter',text);
    return res.json(200);
};