'use strict';

angular.module('pupilsboardApp')
    .controller('SubjectCtrl', function ($scope,$http,$location,$routeParams,$modal,$alert) {
        $scope.questionPaper = null;
        $scope.curQuestionIndex = 0;
        $scope.subjects = [];

        $scope.getSubjects = function (){
            console.log('inside getSubjects');
            $scope.subjects.push('Economy');
            $scope.subjects.push('Indian History');
            $scope.subjects.push('Indian Polity');
            $scope.subjects.push('IGeography');
            $scope.subjects.push('World Geography');
            $scope.subjects.push('General Science');
            $scope.subjects.push('Environment & Ecology');
            $scope.subjects.push('CURRENT AFFAIRS & G.K');
        };

        $scope.startSamplePaper = function (topic){
            console.log('inside startSamplePaper');
            var path = '/samplePaper?samplePaper=1&topic=' + topic;
            console.log(path);
            $location.path('/questions/summary');
        };

//        $scope.getTopics = function (subject){
//            console.log('inside getTopics' + subject);
//            $location.path('/subject/' + subject + '/topics');
//        };

        $scope.initTopics = function (){
            var url = '/api/subject/' + $routeParams.subject + '/topics';

            if (!angular.isObject($scope.topics)){
                console.log('routes: ' + url);
                $http.get(url).error(function(err){
                    console.log('Error while getting topics ' + err);
                })
                .success(function(data){
                    console.log(data);
                    $scope.topics = data;
                });
            };
        };


        $scope.loadQuizForSubjects = function (subject){
            $location.path('/take-test/Quizzes/list?subject=' + subject);
        };

        $scope.loadCategoryPapers = function (category){
            $location.path('/take-test/category/'+ category);
        };

        $scope.loadPaper = function (paperId){
            $location.path('/questionPaper/'+ paperId);
        };

        $scope.initMainSubjects = function (){
            var url = '/api/subject/' + 'Main' + '/topics';
            console.log('routes: ' + url);

            $http.get(url).error(function(err){
                console.log('Error while getting topics ' + err);
            })
            .success(function(data){
                console.log(data);
                $scope.topics = data;
            });
        };

        $scope.getSubjectTopics = function (subject){
            $location.path('/subjects/' + subject + '/topics');
        };

        $scope.getTopicsForSubject = function(){
            var url = '/api/subject/' + 'Main' + '/topics';
            $http.get(url).error(function(err){
                console.log('Error while getting topics ' + err);
            })
            .success(function(data){
                console.log(data);
                $scope.topics = data;
            });
        }
});