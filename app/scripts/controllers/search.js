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
    .controller('SearchCtrl', function ($scope,$http,$location,$routeParams,$modal,$alert) {
        $scope.questionPaper = null;
        $scope.curQuestionIndex = 0;

        $http.get('/api/blog/posts/refreshIndex').error(function(err){
            console.log('Unable to refresh indexes');
        });
});