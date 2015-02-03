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

angular.module('pupilsboardApp')
    .factory('Auth', function Auth($location, $rootScope,$routeParams, Session, User, $cookieStore,$http,$modal) {
        return {
        startPaper: function(user, callback) {
            var cb = callback || angular.noop;

            return Session.save({
                email: user.email,
                password: user.password
            }, function(user) {
                $rootScope.currentUser = user;
                return cb();
            }, function(err) {
                return cb(err);
            }).$promise;
        }
    };

});