'use strict';

/**
 * Custom middleware used by the application
 */
module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */
  auth: function auth(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    res.send(401);
  },

    adminAuth: function(req, res, next) {
        if (req.isAuthenticated()){
            var userInfo = req.user.userInfo;
            if (userInfo.role == 'admin'){
                return next();
            }
        }
        res.send(401);
    },

  /**
   * Set a cookie for angular so it knows we have an http session
   */
  setUserCookie: function(req, res, next) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.userInfo),{ maxAge: 900000 });
    }
    next();
  },

    setTestUserCookie: function(req, res, next) {
        res.cookie('passKey', req.authKey,{ maxAge: 900000 });
        next();
    }
};