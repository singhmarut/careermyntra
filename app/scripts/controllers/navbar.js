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
  .controller('NavbarCtrl', function ($scope, $location, Auth,$http,$modal) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];


    $scope.user = {};
    $scope.errors = {};
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
    };



//    $scope.login = function() {
//        var myAlert = $modal({scope: $scope,title: 'Login',html:true, contentTemplate: 'partials/loginmodal', placement: 'top', type: 'warning', show: true});
//    };

    $scope.signup = function() {
        var myAlert = $modal({scope: $scope,title: 'Sign Up',html:true, contentTemplate: 'partials/signup', placement: 'top', type: 'warning', show: true});
    };

    $scope.loginToPortal = function(form) {
        console.log('inside login');
        $scope.submitted = true;

        if(form.$valid) {
            Auth.login({
                email: $scope.user.email,
                password: $scope.user.password
            })
            .then( function() {
                // Logged in, redirect to home
                $location.path('/');
            })
            .catch( function(err) {
                err = err.data;
                $scope.errors.other = err.message;
            });
        }
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.selectSubjects = function(){
        console.log('select subjects');
        var myModal = $modal({scope:$scope,title: 'Select Subject',
            contentTemplate: 'partials/platform/selectSubjects.html', show: true});
    };
//    $scope.createDummyPaper = function() {
//        console.log('creating dummy paper...');
//        $http.post('/api/createDummyPaper').error(function(err,data){
//            console.log('inside error');
//            $location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
//        })
//        .success(function(err,data){
//                console.log('inside error');
//                $location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
//        });
//    };
  });
