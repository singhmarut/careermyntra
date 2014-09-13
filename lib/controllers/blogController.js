/**
 * Created by Marut on 11/06/14.
 */
var mongoose = require('mongoose'),
    search = require('./search'),
    PaperStatus = mongoose.model('PaperStatus'),
    Comments = mongoose.model('Comments'),
    Article = mongoose.model('Article'),
    Subscription = mongoose.model('Subscription'),
    PassKey = mongoose.model('PassKey');

var moment = require('moment-timezone');

exports.getCorrectDate =function(){
    var publishedAt = moment(new Date()).tz("Asia/Calcutta").format('YYYY MM DD, h:mm:ss a');
    console.log("published At"  + publishedAt);
    return 12;
}

exports.createArticle = function (req, res, next) {
    var accountEmail = req.session.userInfo.email;
    var article = new Article(req.body);
    article.accountId = accountEmail;
    //article.publishedAt = moment().utc('req.body.publishedAt');
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
    var displayAll = false;
    if (req.session.userInfo){
        if (req.session.userInfo.role == 'admin'){
            displayAll = true;
        }
    }
    if (displayAll){
        Article.where().sort('-createdAt').sort('-createdAt').exec(function(err,data){
            if (!err){
                res.json(200,data);
            }else{
                console.log("Error while fetching question paper list " + err);
                res.json(400, err);
            }
        });
    } else{
        Article.where('status').equals('PUBLISHED').sort('-createdAt').exec(function(err,data){
            if (!err){
                res.json(200,data);
            }else{
                console.log("Error while fetching question paper list " + err);
                res.json(400, err);
            }
        });
    }
};

exports.getById = function (req, res, next) {
    Article.findById(req.params.id,function(err,data){
        if (!err){
            res.json(200,data);
        }else{
            console.log("Error while fetching Article " + err);
            res.json(400, err);
        }
    });
};


exports.publishPost = function (req, res, next) {
    Article.findByIdAndUpdate(req.params.id,{status: req.body.status},{upsert:false},function(err,data){
        if (!err){
            search.indexPosts(data._doc);
            res.json(200,data);
        }else{
            console.log("Error while fetching question paper list " + err);
            res.json(400, err);
        }
    });
};

exports.updatePost = function (req, res, next) {
    Article.findByIdAndUpdate(req.params.id,{status: req.body.status,title: req.body.title,content: req.body.content
        ,publishedAt:req.body.publishedAt,tags: req.body.tags},{upsert:false},function(err,data){
        if (!err){
            res.json(200,data);
        }else{
            console.log("Error while updating post " + err);
            res.json(400, err);
        }
    });
};

exports.searchPosts = function (req, res, next) {
    search.searchPosts(req.query.id,function(hits){
        res.json(200,hits);
    });
};

exports.refreshIndexes = function (req, res, next) {
    Article.find().exec(function(err,data){
        if (!err){
            search.buildPostIndex(data);
            res.json(200);
        }else{
            console.log("Error while refreshing blog index " + err);
            res.json(400, err);
        }
    });
};

exports.subscribeForBlog = function (req, res, next) {
    var email =  req.body.email;
    var subscription = new Subscription();
    subscription.email = email;
    subscription.subscriptions.push('blog');

    Subscription.where('email').equals(email).where('subscriptions').equals('blog').exec(function(err,data){
        if (data == undefined || data.length == 0){
            subscription.save();
            res.json(200);
        }else{
            res.json(500);
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

    Article.findById(req.params.id,function(err,article){
        var comment = new Comments();
        comment.text = req.body.comment;
        comment.email = req.session.userInfo.email;
        article.comments.push(comment);
        article.save(function(err,data){
            if (!err){
                res.json(200);
            }else{
                res.json(500);
            }
        });
    });
};
