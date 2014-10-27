'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    emailSender = require('./email'),
    question = require('./questionController'),
    util = require('util'),
    passport = require('passport');

var _ = require('underscore');

/**
 * Create user
 */
exports.create = function (req, res, next) {
    createNewUser(req,res,req.body);
};

function sendEmail(email,msg){
    emailSender.sendEmail(email,"Welcome to ExamCue!!",msg);
}

function createNewUser(req,res,body){
    var referredBy = req.query.referredBy;
    var newUser = new User(body);
    newUser.provider = 'local';
    if (_.isString(referredBy)){
        newUser.referredBy = referredBy;
        var msg = util.format('%s:%s %s', 'Your reference',newUser.email,"has registered on ExamCue. Your exam quota has been updated");
        this.sendEmail(referredBy, "Quota Updated!!",msg);
    }
    User.findOne({'email' : newUser.email}, function(data){
        if (data){
            return res.json(400, "Email already registered");
        }else{

        }
    });

    newUser.save(function(err,savedUser) {
        if (err) {
            return res.json(400,err);
        }
        this.sendEmail(newUser.email, "Welecome to ExamCue!!\n. Click on below link to activate your account","http://examcue.com/account/activate/" + savedUser._id);
        return res.json(200,savedUser);
    });
}

exports.createSocialUser = function (req, res, next) {
    console.log('google data',req.body + 'params: ' + req.params);
    //newUser.provider = 'local';
    return res.json(200);
};

exports.activateAccount = function (req, res, next) {
    var id = req.params.id;
    User.findById(id, function (err, user) {
        if (err) return next(err);
        if (user){
            user.active= true;
            user.save(function(err){
                if (!err){
                    return res.json(200);
                }else {
                    return res.json(500);
                }
            });
        }else{
            return res.json(400);
        }
    });
};

exports.inviteUser = function (req, res, next) {
    var email = req.session.userInfo.emailId;
    //Referred email by this use
    var toEmail = req.query.referredEmail;
    var findUser = User.find().where('emailId').equals(toEmail);
    var query = findUser.exec(function (err, user) {
        if (err) return next(err);
        if (!user){
            emailSender.sendEmail(email,"Welcome to ExamCue!!","http://examcue.com/signup?emailId=" + toEmail+"&referredBy=" + email);
        }else{
            return res.json(400,"User is already registered!!");
        }
    });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Change password
 */
exports.getQuestionsCountMap = function(req, res, next) {
    var userQuestionMap = [];
    var userCount = 0;
    var visitedCount = 0;
    User.find().exec(function (err, users) {
        userCount = users.length;
        _.each(users,function(user){
            question.getQuestionsCountByUser(user.email).then(function(count){
                visitedCount++;
                var countObj = new Object();
                countObj.emailId = user.email;
                countObj.count = count;
                userQuestionMap.push(countObj);
                if (userCount == visitedCount){
                    res.json(200,userQuestionMap);
                }
            })
        });
    });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};