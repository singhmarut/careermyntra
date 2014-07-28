/**
 * Created by Marut on 29/06/14.
 */
'use strict';

angular.module('pupilsboardApp')
    .controller('QuestionCtrl', function ($scope,$http,$upload,$alert,$modal,$route,$routeParams) {
        $scope.questions = [];
        $scope.searchTag = '';
        //$scope.editable=0;
        $scope.curQuestionIndex = 0;
        $scope.search = {};

        $scope.question = {};
        $scope.question.content = '';
        $scope.question.extraContent = '';
        $scope.question.matchingOptions = [];
        $scope.question.choices = [];
        $scope.question.extraTags = '';
        $scope.question.tags = [];
        $scope.allTags = [];
        $scope.choicesData = [];

        //$scope.editable = false;

        $scope.editQuestion = function(editable) {
            editable = 1;
            if (editable == 0){
                CKEDITOR.config.readOnly = true;
            }else{
                CKEDITOR.config.readOnly = false;
            }
        };

        $scope.getAllTags = function(){
            $http.get('/api/questions/tags').error(function(err){
                console.log('error while fetching tags...');
            })
            .success(function(data){
                $scope.allTags = data;
            });
        };

        // setup editor options
        $scope.editorOptions = {
            language: 'en',
            uiColor: '#000000',
            rows: 4,
            cols: 10
        };

        $scope.updateQuestion = function (question){
            if (question.extraTags != 'undefined' && question.extraTags != ''){
                question.tags = [];
                var newTags = question.extraTags.split(",");
                angular.forEach(newTags,function(tag){
                    if (tag && tag != ''){
                        question.tags.push(tag);
                    }
                });
            }

            $http.put('/api/question',JSON.stringify(question)).error(function(err){
               var alert = $modal({
                    "title": "Question Change!",
                    "content": "error while saving question",
                    "type": "error"
                });
            })
            .success(function(data){
                 $scope.editable=0;
                    var alert = $modal({
                        "title": "Question Change!",
                        "content": "Question was saved successfully",
                        "type": "info",
                        placement: 'top-left',
                        show: true
                    });
            });
        };

        $scope.getQuestionFormattedTag = function(question){
            var formattedTag = '';
            angular.forEach(question.tags,function(tag){
                formattedTag += tag + ",";
            })
            question.extraTags = formattedTag;
            return formattedTag;
        }

        $scope.onFileSelect = function($files) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/api/question/upload', //upload.php script, node.js route, or servlet url
                    // method: 'POST' or 'PUT',
                    // headers: {'header-key': 'header-value'},
                    // withCredentials: true,
                    data: {myObj: $scope.myModelObj},
                    file: file
                }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
                    })
                    .error(function(err){
                        $scope.alert = {
                            "title": "Question Change!",
                            "content": "Question was saved successfully",
                            "type": "info"
                        };
                    });
                //.then(success, error, progress);
                //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
            }
        };

        $scope.saveQuestion = function (){
            var tagName = $routeParams.tag;

            var matchingData = $scope.createMatchingQuestionOptions.ngGrid.data;
            var optionsData = $scope.createMatchingChoice.ngGrid.data;
            for (var i = 0, len = matchingData.length; i < len; i++) {
                var matchingOption = new Object();
                matchingOption.option = matchingData[i].option;
                matchingOption.match = matchingData[i].match;
                if (matchingOption.option != '' || matchingOption.match != ''){
                    $scope.question.matchingOptions.push(matchingOption);
                }
            };

            for (var i = 0, len = optionsData.length; i < len; i++) {
                var newOption = new Object();
                newOption.choice = optionsData[i].choice;
                newOption.isCorrectAnswer = optionsData[i].isCorrect;
                $scope.question.choices.push(newOption);
            };

            $scope.question.tags.push(tagName);
            if ($scope.question.extraTags != 'undefined' && $scope.question.extraTags != ''){
                $scope.question.tags.push($scope.question.extraTags.split(","));
            }
            console.log(JSON.stringify($scope.question));
            $http.post('/api/question/',JSON.stringify($scope.question)).error(function(err){
                console.log('inside error');
            })
            .success(function(data){
                var myModal = $modal({title: 'Question Saved', content: 'Question is saved', show: true});
                $route.reload();
            });
        };

        $scope.viewTagQuestions = function(tag){
            var filterUrl = "?";
            if ($scope.search.startDate != undefined && $scope.search.endDate != undefined){
                filterUrl += "&startDate=" + $scope.search.startDate + "&endDate=" + $scope.search.endDate;
            }
            if ($scope.search.endDate != undefined){
                filterUrl += "&endDate=" + $scope.search.endDate;
            }
            if ($scope.search.text != undefined){
                filterUrl += "&text=" + $scope.search.text;
            }
            var questionStatus =  $("#questionStatus").val();
            if (questionStatus != undefined){
                filterUrl += "&status=" + questionStatus;
            }
            $http.get('/api/questions/tag/' + tag + filterUrl).error(function(err){
                console.log('error while fetching questions...');
            })
            .success(function(data){
                console.log('Questions loaded successfully');
                $scope.questions = data;
                $scope.editable=0;
            });
        };

        $scope.matchingQuestion = [{idx: 'Heading',option: "", match: ""},
            {idx: '1',option: "", match: ""},
            {idx: '2',option: "", match: ""},
            {idx: '3',option: "", match: ""},
            {idx: '4',option: "", match: ""}];

        $scope.publishQuestion = function(question){
            question.status = 'PUBLISHED';
            $scope.updateQuestion(question);
        };

        $scope.choicesData = [{seq: '(a)',choice: "",isCorrect:false},
            {seq: "(b)",choice: "",isCorrect:false},
            {seq: '(c)',choice: "",isCorrect:false},
            {seq: '(d)',choice: "",isCorrect:false}];

        $scope.choiceColumnDefs = [
            { field: 'seq', displayName: 'Seq'},
            { field: 'choice', displayName: 'Choice', width: 190,cellTemplate: '<input type="text" style="width: 100%;" ng-model="COL_FIELD"/>' },
            { field: 'isCorrect', displayName: 'Correct Answer', width: 190,cellTemplate: '<input type="checkbox" style="width: 100%;" ng-model="COL_FIELD"/>' }];

        $scope.createMatchingChoice = { data: 'choicesData',
            columnDefs: $scope.choiceColumnDefs,
            enableColumnResize: false,
            showGroupPanel: true,
            enablePaging: false};

        $scope.createMatchingQuestionOptions = { data: 'matchingQuestion',
            columnDefs: [
                { field: 'idx', displayName: ''},
                { field: 'option', displayName: 'Option',width: 190, cellTemplate: '<input type="text" class="gridInput" style="width: 100%;" ng-model="COL_FIELD"/>' },
                { field: 'match', displayName: 'Match', width: 190,cellTemplate: '<input type="text" style="width: 100%;" ng-model="COL_FIELD"/>' }]};

});