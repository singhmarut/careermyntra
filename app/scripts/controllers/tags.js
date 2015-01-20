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
 * Created by wizni on 7/22/14.
 */
'use strict';

angular.module('pupilsboardApp')
    .controller('TagsCtrl', function ($scope,$http,$upload,$alert,$modal,$location) {
        $scope.questions = [];
        $scope.searchTag = '';
        //$scope.editable=0;
        $scope.curQuestionIndex = 0;
        $scope.tags = [];
        $scope.getAllTags = function(){
            $http.get('/api/questions/tags').error(function(err){
                console.log('error while fetching questions...');
            })
            .success(function(data){
                $scope.tags = data;
            });
        };

        $scope.tagsSchema = { data: 'tags',
            columnDefs: [
                { field: 'name', displayName: 'Tag Name', width: 190 },
                { field: 'selected',displayName: 'Select',width: 90,cellTemplate: '<input type="checkbox" ng-input="COL_FIELD" ng-model="COL_FIELD"/>' },
                {field:  'qCount', displayName: 'Count', width: 90 },
                { field: 'upload', displayName: 'Upload Questions',
                    cellTemplate: '<a ng-input="COL_FIELD" ng-href="/addQuestions?tag={{row.entity.name}}" ng-model="COL_FIELD">Upload Questions</a>' }]};

        $scope.addQuestions = function (){
            var data = $scope.tagsSchema.ngGrid.data;
            var tagParam = "";

            for (var idx =0 ; idx < data.length; idx++){
                if (data[idx].selected){
                    tagParam += "&tag=" + data[idx].name;
                }
            }
            console.log("tags: " + tagParam);
            $location.url("/addQuestions?" + tagParam);
        }

        $scope.saveTag = function (question){
            $http.post('/api/questions/tags',{tag:$scope.tags.tag}).error(function(err){
                var modal = $modal({
                    "title": "Tag Added!",
                    "content": "Tag was not added",
                    "type": "error",
                    placement: 'top-left',
                    show: true
                });
            })
            .success(function(data){
                var modal = $modal({
                    "title": "Tag Added!",
                    "content": "Tag was saved successfully",
                    "type": "info",
                    placement: 'top-left',
                    show: true
                });
            });
        };
});