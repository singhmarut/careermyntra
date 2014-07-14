/**
 * Created by Marut on 11/06/14.
 */
var mongoose = require('mongoose'),
    PaperStatus = mongoose.model('PaperStatus'),
    Comments = mongoose.model('Comments'),
    Article = mongoose.model('Article'),
    PassKey = mongoose.model('PassKey');

exports.createArticle = function (req, res, next) {
    var accountEmail = req.session.userInfo.email;
    var article = new Article(req.body);
    article.accountId = accountEmail;

    article.save(function(err){
        if (!err){
            res.json(200);
        }else{
            console.log("Error while fetching question paper list " + err);
            res.json(400, err);
        }
    });
};

exports.getArticles = function (req, res, next) {
    Article.find({},function(err,data){
        if (!err){
            res.json(200,data);
        }else{
            console.log("Error while fetching question paper list " + err);
            res.json(400, err);
        }
    });
};

/**
 * Created by Marut on 13/07/14.
 */


//exports.createArticle = function (req, res, next) {
//    var accountEmail = req.session.userInfo.email;
//    var article = new Article();
//    article.accountId = accountEmail;
//    article.title = req.params.title;
//    article.save(function(err){
//        if (!err){
//            res.json(200);
//        }else{
//            console.log("Error while creating new post " + err);
//            res.json(400, err);
//        }
//    });
//};

exports.addComment = function (req, res, next) {
    var comment = new Comments();
    comment.emailId = req.session.userInfo.email;
    article.save(function(err){
        if (!err){
            res.json(200);
        }else{
            console.log("Error while fetching question paper list " + err);
            res.json(400, err);
        }
    });
};
