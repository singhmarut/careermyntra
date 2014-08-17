'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy;

/**
 * Passport configuration
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    done(err, user);
  });
});

// add other strategies for more authentication flexibility
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    User.findOne({
      email: email.toLowerCase()
    }, function(err, user) {
      if (err) return done(err);
      
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'This password is not correct.'
        });
      }
      return done(null, user);
    });
  }
));

passport.use(new GoogleStrategy({
        returnURL: 'http://www.pariksharthi.com/api/auth/google/return',
        realm: 'http://www.pariksharthi.com'
    },
    function(identifier, profile, done) {
        User.findOne({
            openId: identifier
        }, function(err, user) {
            if (err) return done(err);

            if (!user) {
                User.save({openId: identifier,role: 'user', 'email' : profile.emails[0].value,name: profile.name.givenName},function(err,user){
                    if(!err){
                        return done(null, user, {
                            message: 'This email is not registered.'
                        });
                    }else{
                        return done(null, false, {
                            message: 'This email is not registered.'
                        });
                    }
                });
            }else{
                return done(null, user);
            }
        });
//        User.findOrCreate({ openId: identifier }, function(err, user) {
//            done(err, user);
//        });
    }
));
//var config = app.get('env');
//// config
//passport.use(new GoogleStrategy({
//        returnURL: config.google.returnURL,
//        realm: config.facebook.realm
//    },
//    function(accessToken, refreshToken, profile, done) {
//        return done(null, profile);
////        process.nextTick(function () {
////            return done(null, profile);
////        });
//    }
//));

module.exports = passport;
