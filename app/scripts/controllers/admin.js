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
 * Created by wizni on 9/10/14.
 */

'use strict';

angular.module('pupilsboardApp')
    .controller('AdminCtrl', function ($scope, Auth, $location,$http,$modal) {
        $scope.userQuestionCount = [];

        $scope.getQuestionsPerAccount = function(){
            $http.get('/api/questions/summary').success(function(data){
                $scope.userQuestionCount = data;
            })
            .error(function(err){
                console.log('inside error');
            });
        };

        $scope.questionReportSchema = { data: 'userQuestionCount',
            columnDefs: [
                { field: 'emailId', displayName: 'User Id', width: 190 },
                {field:  'count', displayName: 'Count', width: 90 }]};


    });
