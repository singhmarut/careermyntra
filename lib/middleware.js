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

   isAuthenticated: function isAuthenticated(req){
       if (req.isAuthenticated()){
           return true;
       }
       return false;
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

    questionAdminAuth: function(req, res, next) {
        if (req.isAuthenticated()){
            var userInfo = req.user.userInfo;
            if (userInfo.role == 'admin' || userInfo.role == 'questionAdmin'){
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