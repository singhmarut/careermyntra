/**
 * Created by Marut on 29/06/14.
 */
'use strict';

angular.module('pupilsboardApp')
    .controller('QuestionCtrl', function ($scope,$http,$location,$routeParams) {

    $scope.questions = [];
    $scope.searchTag = '';
    $scope.curQuestionIndex = 0;
    $scope.viewTagQuestions = function(tag){

        $http.get('/api/questions/tag/' + tag).error(function(err){
            console.log('error while fetching questions...');
        })
        .success(function(data){
            console.log('Questions loaded successfully');
            $scope.questions = data;
        });
    };
});