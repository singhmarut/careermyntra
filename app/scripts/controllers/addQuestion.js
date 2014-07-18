/**
 * Created by Marut on 29/06/14.
 */
'use strict';

angular.module('pupilsboardApp')
    .controller('AddquestionCtrl', function ($scope,$http,$upload,$alert) {
        $scope.question = {};
        $scope.question.text = '';

        $scope.saveQuestion = function (){
           console.log($scope.question.text);
        };

        $scope.matchingQuestion = [{idx: '',option: "", match: ""},
            {idx: '1',option: "", match: ""},
            {idx: '2',option: "", match: ""},
            {idx: '3',option: "", match: ""},
            {idx: '4',option: "", match: ""}];

        $scope.matchingQuestionOption = [{seq: '(a)',choice: ""},
            {seq: "(b)",choice: ""},
            {seq: '(c)',choice: ""},
            {seq: '(d)',choice: ""},
            {seq: '(e)',choice: ""}];

//        $scope.matchingQuestionText = { data: 'questions',
//            columnDefs: [
//                { field: 'content', displayName: 'Text',width: 90,height:180},
//                { field: '_id', displayName: 'Id', width: 90,cellTemplate: '<input type="text" ng-input="COL_FIELD" ng-model="COL_FIELD" disabled/>' },
//                { field: 'selected',displayName: 'Select',width: 90,cellTemplate: '<input type="checkbox" ng-input="COL_FIELD" ng-model="COL_FIELD"/>' }]};

        $scope.createMatchingChoice = { data: 'matchingQuestionOption',
            columnDefs: [
                { field: 'seq', displayName: 'Seq'},
                { field: 'choice', displayName: 'Choice', width: 190,cellTemplate: '<input type="text" ng-input="COL_FIELD" ng-model="COL_FIELD"/>' }]};

        $scope.createMatchingQuestionOptions = { data: 'matchingQuestion',
            columnDefs: [
                { field: 'idx', displayName: ''},
                { field: 'option', displayName: 'Option',width: 190, cellTemplate: '<input type="text" class="gridInput" ng-input="COL_FIELD" ng-model="COL_FIELD"/>' },
                { field: 'match', displayName: 'Match', width: 190,cellTemplate: '<input type="text" ng-input="COL_FIELD" ng-model="COL_FIELD"/>' }]};
    });