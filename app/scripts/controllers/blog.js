/**
 * Created by Marut on 26/06/14.
 */

'use strict';

angular.module('pupilsboardApp')
    .controller('BlogCtrl', function ($scope, $http,$location,$routeParams) {

        $scope.tags = '';
        $scope.articles = [];
        $scope.createPost = function(form){
            var tags = $scope.post.tags.split(",");
            $http.post('/api/blog/post',{title: $scope.post.title,
                                         content: $scope.post.content,tags:tags})
            .success(function(data) {
                $location.path('/');
            }).error(function(err) {
                    console.log("Unable to post article" + err);
            });
        };

        $scope.addTag = function(){
           $scope.tags = $scope.post.tags;
        };

        $scope.getAllPosts = function(){
            var postId = $routeParams.id;
            if (postId == undefined){
                $http.get('/api/blog/posts')
                    .success(function(data) {
                        $scope.articles = data;
                    }).error(function(err) {
                        console.log("Unable to post article" + err);
                    });
            }else{
//                $location.path('/posts/'+postId);
//                $http.get('/api/blog/posts/' + postId)
//                    .success(function(data) {
//                        $scope.articles = data;
//                        console.log(JSON.stringify(data));
//                    }).error(function(err) {
//                        console.log("Unable to get articles" + err);
//                    });
                //$location.path('/posts/'+postId);
            }
        };

        $scope.getPostById = function(){
            var postId = $routeParams.id;
            $http.get('/api/blog/posts/' + postId)
                .success(function(data) {
                    $scope.articles.push(data);
                    console.log(JSON.stringify($scope.articles));
            }).error(function(err) {
                console.log("Unable to get articles" + err);
            });
        };

});
