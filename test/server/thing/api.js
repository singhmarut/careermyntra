'use strict';

var should = require('should'),
    app = require('../../../server'),
    blog = require('../../../lib/controllers/blogController'),
    analytics = require('../../../lib/controllers/analyticsController'),
    request = require('supertest');

//describe('GET /api/awesomeThings', function() {
//
////    before(function(done) {
////        user = new User({
////            provider: 'local',
////            name: 'Fake User',
////            email: 'test@test.com',
////            password: 'password'
////        });
////
////        // Clear users before testing
////        User.remove().exec();
////        done();
////    });
//
//  it('should respond with JSON array', function(done) {
//    request(app)
//      .get('/api/awesomeThings')
//      .expect(200)
//      .expect('Content-Type', /json/)
//      .end(function(err, res) {
//        if (err) return done(err);
//        res.body.should.be.instanceof(Array);
//        done();
//      });
//  });
//
//
//    it('should return 12', function(done) {
//        blog.getCorrectDate().should.equal(12);
//    });
//
//    it('should return questions', function(done) {
//        var years = ['2008']
//        analytics.getQuestionStats(years,'UPSC',['Polity'])
//    });
//
//
//});

exports['calculate'] = function (test) {
    test.equal( analytics.getQuestionStats(['2008'],'UPSC',['Polity']), 4);
    test.done();
};

exports['addExtraTags'] = function (test) {
     request(app)
      .put('/api/question/tags')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });

};