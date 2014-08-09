/**
 * Created by Marut on 29/06/14.
 */
'use strict';

angular.module('pupilsboardApp')
    .controller('AddquestionCtrl', function ($scope,$http,$upload,$alert,$modal,$route,$routeParams) {
        $scope.question = {};
        $scope.question.content = '';
        $scope.question.extraContent = '';
        $scope.question.matchingOptions = [];
        $scope.question.choices = [];
        $scope.allTags = [];

//        $scope.getAllTags = function(){
//            $http.get('/api/questions/tags').error(function(err){
//                console.log('error while fetching tags...');
//            })
//            .success(function(data){
//                $scope.allTags = data;
//            });
//        };

        $scope.saveQuestion = function (){
            var matchingData = $scope.createMatchingQuestionOptions.ngGrid.data;
            var optionsData = $scope.createMatchingChoice.ngGrid.data;
            for (var i = 0, len = matchingData.length; i < len; i++) {
                var matchingOption = new Object();
                matchingOption.option = matchingData[i].option;
                matchingOption.match = matchingData[i].match;
                matchingOption.isHeader = matchingData[i].isHeader;
                $scope.question.matchingOptions.push(matchingOption);
            };

            for (var i = 0, len = optionsData.length; i < len; i++) {
                var newOption = new Object();
                newOption.choice = optionsData[i].choice;
                $scope.question.choices.push(matchingOption);
            };
            $scope.question.tags = [];
            $scope.question.tags.push($routeParams.tag);

            $http.post('/api/question/',JSON.stringify($scope.question)).error(function(err){
                console.log('inside error');
            })
            .success(function(data){
                    var myModal = $modal({title: 'Question Saved', content: 'Question is saved', show: true});
                    $route.reload();
            });
        };

        $scope.matchingQuestion = [{idx: 'Heading',option: "", match: "",isHeader: true},
            {idx: '1',option: "", match: "",isHeader: false},
            {idx: '2',option: "", match: "",isHeader: false},
            {idx: '3',option: "", match: "",isHeader: false},
            {idx: '4',option: "", match: "",isHeader: false}];

//        $scope.addjQueryToPartial = function()
//        {
//            $(document).on("click", "#saveQuestion", function() {
//                alert('yo');
//            });
////            angular.element('saveQuestion').click(function() //angular way of accessing jQuery
////            {
////                alert('yo');
////            });
//        }

        $scope.matchingQuestionOption = [{seq: '(a)',choice: ""},
            {seq: "(b)",choice: ""},
            {seq: '(c)',choice: ""},
            {seq: '(d)',choice: ""}];

//        $scope.matchingQuestionText = { data: 'questions',
//            columnDefs: [
//                { field: 'content', displayName: 'Text',width: 90,height:180},
//                { field: '_id', displayName: 'Id', width: 90,cellTemplate: '<input type="text" ng-input="COL_FIELD" ng-model="COL_FIELD" disabled/>' },
//                { field: 'selected',displayName: 'Select',width: 90,cellTemplate: '<input type="checkbox" ng-input="COL_FIELD" ng-model="COL_FIELD"/>' }]};

        $scope.createMatchingChoice = { data: 'matchingQuestionOption',
            columnDefs: [
                { field: 'seq', displayName: 'Seq'},
                { field: 'choice', displayName: 'Choice', width: 190,cellTemplate: '<input type="text" ng-input="COL_FIELD" style="width: 100%;" ng-model="COL_FIELD"/>' }]};

        $scope.createMatchingQuestionOptions = { data: 'matchingQuestion',
            columnDefs: [
                { field: 'idx', displayName: ''},
                { field: 'option', displayName: 'Option',width: 190, cellTemplate: '<input type="text" class="gridInput" style="width: 100%;" ng-input="COL_FIELD" ng-model="COL_FIELD"/>' },
                { field: 'match', displayName: 'Match', width: 190,cellTemplate: '<input type="text" ng-input="COL_FIELD" style="width: 100%;" ng-model="COL_FIELD"/>' }]};
    });