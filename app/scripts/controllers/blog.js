/**
 * Created by Marut on 26/06/14.
 */

'use strict';

angular.module('pupilsboardApp')
    .controller('BlogCtrl', function ($scope, $http,$location,$routeParams) {

//        $scope.getAnswerSheets = function(){
//            $http.get('/api/candidate/candidatePapers').success(function(data) {
//                $scope.answerSheets = data;
//            }).error(function(err) {
//                    console.log("Unable to fetch candidate data " + err);
//            });
//        };
//
//        $scope.loadAnswerSheet = function(){
//            $http.get('/api/candidate/' + $routeParams.passKey +  '/answerSheets').success(function(data) {
//                $scope.candidateReport = data;
//            }).error(function(err) {
//                    console.log("Unable to fetch candidate data " + err);
//                });
//        };

        $scope.createPost = function(form){
            $http.post('/api/blog/post',{title: $scope.post.title,
                                         content: $scope.post.content})
            .success(function(data) {
                $location.path('/');
            }).error(function(err) {
                    console.log("Unable to post article" + err);
            });
        };

        $scope.getAllPosts = function(){
            $http.get('/api/blog/posts')
                .success(function(data) {
                    $scope.articles = data;
                }).error(function(err) {
                    console.log("Unable to post article" + err);
                });
        };
});
