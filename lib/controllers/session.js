/*
 * Copyright (c) 2015. All rights reserved.
 *
 *   This file is created and owned by careermyntra. software licensed to you under enterprise Software License Agreement (the "License")
 *   You may not use this file except in compliance with the License. For licensing contact: support@careermyntra.com
 *
 *   Unauthorized reverse engineering, disassembly or modifications prohibited.
 *   CareerMyntra Confidential
 */

'use strict';

var mongoose = require('mongoose'),
    passport = require('passport');

/**
 * Logout
 */
exports.logout = function (req, res) {
  req.logout();
  res.send(200);
};

/**
 * Login
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error || !user.active) return res.json(401, error);

    req.logIn(user, function(err) {
      
      if (err) return res.send(err);
      req.session.userInfo = req.user.userInfo;
      req.session.user = req.user;
      res.json(req.user.userInfo);
    });
  })(req, res, next);
};

/**
 * Login
 */
//exports.loginByGoogle = function (req, res,next) {
//    passport.authenticate('google', { failureRedirect: '/' },
//        function(req, res) {
//            res.redirect('/account');
//        };
//};