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
    questionLoader = require('./controllers/questionLoader');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
//  app.route('/api/awesomeThings')
//    .get(api.awesomeThings);
//
    app.route('/api/emitEvent')
        .get(questionPaper.emitEvent);

      app.route('/api/users')
        .post(users.create)
        .put(users.changePassword);
      app.route('/api/users/me')
        .get(middleware.auth,users.me);
      app.route('/api/users/:id')
        .get(middleware.auth,users.show);

    app.route('/api/session')
        .post(session.login)
        .delete(session.logout);

    app.route('/api/answerSheet')
        .post(answerSheet.create);

    app.route('/api/registerForNewsLetter')
        .post(middleware.setTestUserCookie,email.registerForNewsLetterEmail);

    app.route('/api/createDummyPaper')
        .post(middleware.auth,questionPaper.createDummyPaper);

    app.route('/api/question')
        .post(middleware.auth,question.saveQuestion);

    app.route('/api/questionPaper/:id')
        .get(middleware.setTestUserCookie,questionPaper.getById);

    app.route('/api/question/upload')
        .post(middleware.auth,questionLoader.uploadQuestions);

    app.route('/api/candidate/:passKey/answerSheets')
        .get(middleware.auth,answerSheet.getAnswerSheets);

    app.route('/api/candidate/answerSheets')
        .get(middleware.auth,answerSheet.getCandidateAnswerSheets);

    app.route('/api/questions/tag/:tag')
        .get(middleware.auth,question.getQuestionsByTag);

    app.route('/api/questionPaper/list')
        .get(middleware.auth,questionPaper.getQuestionPaperList);

    app.route('/api/questionPaper/:id/score')
        .get(middleware.auth,questionPaper.startScoring);

    app.route('/api/questionPaper/:id/passKeys')
        .post(middleware.auth,passKey.generateKeys);

    app.route('/api/questionPaper/load/:authKey')
        .get(middleware.setTestUserCookie,questionPaper.getByAuthKey);


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