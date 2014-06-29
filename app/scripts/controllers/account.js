'use strict';

angular.module('pupilsboardApp')
    .controller('AccountCtrl', function ($scope, Auth, $location,$http) {
        $scope.user = {};
        $scope.questionPaperList = [];

        $scope.getQuestionPapers = function(){
            $http.get('/api/questionPaper/list').success(function(data){
                 $scope.questionPaperList = data;
                //$location.path('/dashboard'); //use $location.path(url).replace() if you want to replace the location instead
            })
            .error(function(err){
                console.log('inside error');
                //$location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
            });
        };

        $scope.loadPaper = function(id){
            console.log('loadingpaper' + id);
            $location.path('/questionPaper/' + id);
        };

        $scope.startEvaluate = function(id){
            console.log('starting scoring for paper' + id);
            $http.get('/api/questionPaper/' + id + '/score').success(function(data){
                $scope.questionPaperList = data;
                //$location.path('/dashboard'); //use $location.path(url).replace() if you want to replace the location instead
            })
            .error(function(err){
                console.log('inside error');
                //$location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
            });
        };

        $scope.generatePassKeys = function(id){
            var body = new Object();

            $http.post('/api/questionPaper/' + id + '/passKeys',{'emails': ['singh.marut@gmail.com','support@careermyntra.com','manoj@careermyntra.com']}).success(function(data){
                //$scope.questionPaperList = data;
                //$location.path('/dashboard'); //use $location.path(url).replace() if you want to replace the location instead
            })
            .error(function(err){
                    console.log('error in creating passKeys');
                    //$location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
            });
        };
});
