/**
 * Created by Marut on 29/06/14.
 */
'use strict';

angular.module('pupilsboardApp')
    .controller('QuestionCtrl', function ($scope,$http,$upload,$alert) {
        $scope.questions = [];
        $scope.searchTag = '';
        //$scope.editable=0;
        $scope.curQuestionIndex = 0;
        //$scope.editable = false;
        $scope.viewTagQuestions = function(tag){

            $http.get('/api/questions/tag/' + tag).error(function(err){
                console.log('error while fetching questions...');
            })
            .success(function(data){
                console.log('Questions loaded successfully');
                $scope.questions = data;
                    $scope.editable=0;
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

        // setup editor options
        $scope.editorOptions = {
            language: 'en',
            uiColor: '#000000',
            rows: 4,
            cols: 10
        };

        $scope.saveQuestion = function (question){
            $http.post('/api/question',JSON.stringify(question)).error(function(err){
               var alert = $alert({
                    "title": "Question Change!",
                    "content": "error while saving question",
                    "type": "error"
                });
            })
            .success(function(data){
                 $scope.editable=0;
                    var alert = $alert({
                        "title": "Question Change!",
                        "content": "Question was saved successfully",
                        "type": "info",
                        placement: 'top-left',
                        duration: 2,
                        show: true
                    });
            });
        };

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
});