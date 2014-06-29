/**
 * Created by Marut on 29/06/14.
 */
'use strict';

angular.module('pupilsboardApp')
    .controller('QuestionCtrl', function ($scope,$http,$location,$routeParams) {

    $scope.questions = [];
    $scope.searchTag = '';
    $scope.curQuestionIndex = 0;
    //$scope.editable = false;
    $scope.viewTagQuestions = function(tag){

        $http.get('/api/questions/tag/' + tag).error(function(err){
            console.log('error while fetching questions...');
        })
        .success(function(data){
            console.log('Questions loaded successfully');
            $scope.questions = data;
        });
    };

    $scope.editQuestion = function(editable) {
        editable = 1;
        if (editable == 0){
            CKEDITOR.config.readOnly = true;
        }else{
            CKEDITOR.config.readOnly = false;
        }
    };

    $scope.saveQuestion = function (question){
        $http.post('/api/question',JSON.stringify(question)).error(function(err){
            console.log('error while saving paper...');
        })
        .success(function(data){
            console.log('Paper finished successfully');
            $location.path('/paperCompleted');
        });
    };
});