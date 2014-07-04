var mongoose = require('mongoose'),
    PaperStatus = mongoose.model('PaperStatus'),
    AnswerSheet = mongoose.model('AnswerSheet'),
    QuestionPaper = mongoose.model('QuestionPaper'),
    PassKey = mongoose.model('PassKey');

var _ = require('underscore'),
    emailSender = require('./email'),
    crypto = require('crypto');


exports.generateKeys = function (req, res, next) {

    var passKeyRecs = [] ;
     //ToDO: This is CPU Intensive operation......needs to be done in a Java (Play) Process
     _.each(req.body.emails,function(email){
         var passKeyRec = new PassKey();
         passKeyRec.generatedTime = new Date();
         passKeyRec.questionPaperId = req.params.id;
         passKeyRec.email = email;
         passKeyRec.passKey = getRandomKey();
         //TODO: Pass scheduleId from UI
         //passKeyRec.scheduleId = ree.body.scheduleId
         passKeyRec.save(function(err){
             if (err){
                 return res.json(503,"Unable to create pass key")
             }else{
                 sendEmail(email,passKeyRec.passKey);
                 return res.json(200,"Generated pass Keys");
             }
         });
     })
//    PassKey.collection.insert(passKeyRecs,function(err){
//        if (err){
//            return res.json(503,"Unable to create pass key")
//        }else{
//            return res.json(200,"Generated pass Keys");
//        }
//    });
};

function getRandomKey(){
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var randKey = crypto.createHash('sha1').update(current_date + random).digest('hex');
    return randKey;
};

function sendEmail(email,text){
    emailSender.sendEmail(email,text);
}