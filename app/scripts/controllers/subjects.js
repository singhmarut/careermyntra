'use strict';

angular.module('pupilsboardApp')
    .controller('SubjectCtrl', function ($scope,$http,$location,$routeParams,$modal,$alert) {
        $scope.questionPaper = null;
        $scope.curQuestionIndex = 0;
        $scope.subjects = [];

        $scope.getSubjects = function (){
            console.log('inside getSubjects');
            $scope.subjects.push('Polity');
        };

        $scope.startSamplePaper = function (topic){
            console.log('inside startSamplePaper');
            var path = '/questionPaper?samplePaper=1&topic=' + topic;
            console.log(path);
            $location.path(path);
        };

//        $scope.getTopics = function (subject){
//            console.log('inside getTopics' + subject);
//            $location.path('/subject/' + subject + '/topics');
//        };

        $scope.initTopics = function (){
            var url = '/api/subject/' + $routeParams.subject + '/topics';
            console.log('routes: ' + url);

            $http.get(url).error(function(err){
                console.log('Error while getting topics ' + err);
            })
            .success(function(data){
                console.log(data);
                $scope.topics = data;
            });
        }
});