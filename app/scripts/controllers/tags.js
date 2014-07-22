/**
 * Created by wizni on 7/22/14.
 */
'use strict';

angular.module('pupilsboardApp')
    .controller('TagsCtrl', function ($scope,$http,$upload,$alert,$modal) {
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
                { field: 'upload', displayName: 'Upload Questions',
                    cellTemplate: '<a ng-input="COL_FIELD" ng-href="/addQuestions?tag={{row.entity.name}}" ng-model="COL_FIELD">Upload Questions</a>' }]};


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