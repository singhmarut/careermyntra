/*
 * Copyright (c) 2015. All rights reserved.
 *
 *   This file is created and owned by careermyntra. software licensed to you under enterprise Software License Agreement (the "License")
 *   You may not use this file except in compliance with the License. For licensing contact: support@careermyntra.com
 *
 *   Unauthorized reverse engineering, disassembly or modifications prohibited.
 *   CareerMyntra Confidential
 */

/**
 * Created by Marut on 26/06/14.
 */

'use strict';

angular.module('pupilsboardApp')
    .controller('CandidateDashboardCtrl', function ($scope, $http,$location,$routeParams) {

        $scope.getAnswerSheets = function(){
            $http.get('/api/candidate/candidatePapers').success(function(data) {
                $scope.answerSheets = data;
            }).error(function(err) {
                 console.log("Unable to fetch candidate data " + err);
            });
        };

        $scope.loadAnswerSheet = function(){
            $http.get('/api/candidate/' + $routeParams.passKey +  '/answerSheets').success(function(data) {
                $scope.candidateReport = data;
            }).error(function(err) {
                    console.log("Unable to fetch candidate data " + err);
            });
        };
});
