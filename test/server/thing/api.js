'use strict';

var should = require('should'),
    app = require('../../../server'),
    blog = require('../../../lib/controllers/blogController'),
    request = require('supertest');

describe('GET /api/awesomeThings', function() {

//    before(function(done) {
//        user = new User({
//            provider: 'local',
//            name: 'Fake User',
//            email: 'test@test.com',
//            password: 'password'
//        });
//
//        // Clear users before testing
//        User.remove().exec();
//        done();
//    });

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/awesomeThings')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });


    it('should return 12', function(done) {
        blog.getCorrectDate().should.equal(12);
    });
});