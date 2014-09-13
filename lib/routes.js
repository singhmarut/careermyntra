'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    question = require('./controllers/questionController'),
    questionPaper = require('./controllers/questionPaper'),
    answerSheet = require('./controllers/answerSheet'),
    passKey = require('./controllers/passKey'),
    email = require('./controllers/email'),
    middleware = require('./middleware'),
    passport = require('passport'),
    blogger = require('./controllers/blogController'),
    feed = require('./controllers/feed'),
    tags = require('./controllers/tagsController');

/**
 * Application routes
 */
module.exports = function(app) {

    app.route('/api/emitEvent')
        .get(questionPaper.emitEvent);

    app.route('/api/users')
        .post(users.create)
        .put(users.changePassword);
    app.route('/api/users/me')
        .get(middleware.auth,users.me);
    app.route('/api/users/:id')
        .get(middleware.auth,users.show);

    app.get('/api/auth/google',
        passport.authenticate('google'),
        function(req, res){
    });


    app.get('/api/auth/google/return',
        users.createSocialUser
    );

    app.route('/account/activate/:id')
        .get(users.activateAccount);

    app.route('/api/session')
        .post(session.login)
        .delete(session.logout);

    app.route('/api/answerSheet')
        .post(answerSheet.create);

    app.route('/api/answerSheet/:id/question/:questionId/comment')
        .put(answerSheet.saveComment);

    app.route('/api/registerForNewsLetter')
        .post(middleware.setTestUserCookie,email.registerForNewsLetterEmail);

    app.route('/api/sendFeedback')
        .post(middleware.setTestUserCookie,email.sendFeedbackEmail);

    app.route('/api/question')
        .put(middleware.auth,question.updateQuestion);

    app.route('/api/question')
        .post(middleware.adminAuth,question.addQuestion);

    app.route('/api/question/extraTags')
        .put(question.addExtraTags);

    app.route('/api/questionPaper')
        .get(middleware.adminAuth,questionPaper.getQuestionPaperList);

    app.route('/api/questionPaper/publish/:id')
        .put(middleware.adminAuth,questionPaper.publishPaper);

    app.route('/api/questionPaper')
        .post(middleware.auth,questionPaper.createNewPaper);

    app.route('/api/questionPaper/:id')
        .get(middleware.setTestUserCookie,questionPaper.getById);

    app.route('/api/questionPaper/:id/instruction')
        .get(middleware.setTestUserCookie,questionPaper.getInstruction);

    app.route('/api/questionPaper/:id/markSheets')
        .get(middleware.adminAuth,answerSheet.getMarkSheetsByPaper);

    app.route('/api/question/upload')
        .post(middleware.adminAuth,question.uploadQuestions);

    app.route('/api/questions/tags')
        .get(middleware.adminAuth,tags.getAll);

    app.route('/api/questions/tags')
        .post(middleware.adminAuth,tags.addNewTag);

    app.route('/api/blog/posts')
        .get(blogger.getArticles);

    app.route('/api/blog/posts/search')
        .get(blogger.searchPosts);

    app.route('/api/blog/posts/refreshIndex')
        .get(middleware.adminAuth,blogger.refreshIndexes);

    app.route('/api/blog/posts/:id')
        .get(blogger.getById)
        .put(blogger.updatePost);

    app.route('/api/blog/post')
        .post(middleware.adminAuth,blogger.createArticle);

    app.route('/api/blog/post/:id/comment')
        .post(middleware.auth,blogger.addComment);

    app.route('/api/blog/post/:id/status')
        .put(middleware.adminAuth,blogger.publishPost);

    app.route('/api/blog/subscribe')
        .post(blogger.subscribeForBlog);

    app.route('/api/blog/feed')
        .get(feed.getFeed);

    app.route('/api/candidate/:passKey/answerSheets')
        .get(middleware.auth,answerSheet.getAnswerSheets);

    app.route('/api/candidate/candidatePapers')
        .get(middleware.auth,questionPaper.getCandidatePapers);

    app.route('/api/candidate/answerSheets')
        .get(middleware.auth,answerSheet.getCandidateAnswerSheets);

    /**
     * Return answersheet specific
     */
    app.route('/api/candidate/answerSheets/:id')
        .get(middleware.auth,answerSheet.getCandidateAnswerSheetByPaperId);

    app.route('/api/questions/filter')
        .get(middleware.adminAuth,question.getQuestionsByTag);

    app.route('/api/questions/summary')
        .get(middleware.adminAuth,users.getQuestionsCountMap);

//    app.route('/api/questions/tag/:tag')
//        .get(middleware.adminAuth,question.getQuestionsByTag);


    app.route('/api/questionPaper/:id/score')
        .get(middleware.adminAuth,questionPaper.startScoring);

    app.route('/api/questionPaper/:id/passKeys')
        .post(middleware.adminAuth,passKey.generateKeys);

    app.route('/api/questionPaper/load/:authKey')
        .get(middleware.auth,questionPaper.getByAuthKey);


    // All undefined api routes should return a 404
    app.route('/api/*')
        .get(function(req, res) {
            res.send(404);
        });

    // All other routes to use Angular routing in app/scripts/app.js
    app.route('/partials/*')
        .get(index.partials);
    app.route('/*')
        .get( middleware.setUserCookie, index.index);
};