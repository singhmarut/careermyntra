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
    .controller('AccountCtrl', function ($scope, Auth, $location,$http,$modal) {
        $scope.user = {};
        $scope.questionPaperList = [];

        $scope.getQuestionPapers = function(){
            $http.get('/api/questionPaper').success(function(data){
                 $scope.questionPaperList = data;
                //$location.path('/dashboard'); //use $location.path(url).replace() if you want to replace the location instead
            })
            .error(function(err){
                console.log('inside error');
                //$location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
            });
        };

        $scope.loadPaper = function(id){
            console.log('loadingpaper' + id);
            $location.path('/questionPaper/' + id);
        };

        $scope.publishPaper = function(id){
            $http.put('/api/questionPaper/publish/' + id).success(function(data){
                var myAlert = $modal({title: 'Question Paper', content: 'Paper published successfully', placement: 'top', type: 'info', show: true});
            })
            .error(function(err){
                    $modal({title: 'Question Paper', content: 'Unable to publish Paper', placement: 'top', type: 'error', show: true});
            });
        };

        $scope.startEvaluate = function(id){
            console.log('starting scoring for paper' + id);
            $http.get('/api/questionPaper/' + id + '/score').success(function(data){
                $scope.questionPaperList = data;
                //$location.path('/dashboard'); //use $location.path(url).replace() if you want to replace the location instead
            })
            .error(function(err){
                console.log('inside error');
                //$location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
            });
        };

        $scope.generatePassKeys = function(id){
            var body = new Object();

            $http.post('/api/questionPaper/' + id + '/passKeys',{'emails': ['singh.marut@gmail.com','support@careermyntra.com','manoj@careermyntra.com']}).success(function(data){
                //$scope.questionPaperList = data;
                //$location.path('/dashboard'); //use $location.path(url).replace() if you want to replace the location instead
            })
            .error(function(err){
                    console.log('error in creating passKeys');
                    //$location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
            });
        };
});
