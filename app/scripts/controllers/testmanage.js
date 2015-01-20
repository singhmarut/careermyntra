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
  .controller('TestmanageCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
   /* $scope.takeTest = function(){
        $http.get('/api/questionPaper?authKey='+ $scope.authKey).error(function(err,data){
            console.log('inside error');
            $location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
        }).success(function(err,data){
                console.log('inside error');
                $location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead

        });
    };*/
  });
