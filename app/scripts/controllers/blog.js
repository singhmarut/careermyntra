/*
 * Copyright (c) 2015. All rights reserved.
 *
 *   This file is created and owned by careermyntra. software licensed to you under enterprise Software License Agreement (the "License")
 *   You may not use this file except in compliance with the License. For licensing contact: support@careermyntra.com
 *
 *   Unauthorized reverse engineering, disassembly or modifications prohibited.
 *   CareerMyntra Confidential
 */

/**
 * Created by Marut on 26/06/14.
 */

'use strict';

angular.module('pupilsboardApp')
    .controller('BlogCtrl', function ($scope, $http,$location,$routeParams,$alert) {

        $scope.tags = '';
        $scope.blog={};
        $scope.blog.subscriptionEmail = '';
        $scope.articles = [];
        $scope.createPost = function(form){
            var tags = $scope.post.tags.split(",");
            $http.post('/api/blog/post',{title: $scope.post.title,
                                         content: $scope.post.content,tags:tags})
            .success(function(data) {
                $location.path('/posts');
            }).error(function(err) {
                    console.log("Unable to post article" + err);
            });
        };

        $scope.createPost = function(form,status){
            var tags = $scope.post.tags.split(",");
            $http.post('/api/blog/post',{title: $scope.post.title,
                content: $scope.post.content,tags:tags,status:status,publishedAt:$scope.publishedAt})
                .success(function(data) {
                    $location.path('/posts');
                }).error(function(err) {
                    console.log("Unable to post article" + err);
                });
        };

        $scope.getPostForEdit = function(){
            var action = $routeParams.action;

            var postId = $routeParams.id;
            $http.get('/api/blog/posts/' + postId)
                .success(function(data) {
                   $scope.post = data;
                }).error(function(err) {
                    console.log("Unable to get articles" + err);
                });
        };

        $scope.publishPost = function(post,status){
            var tags = post.tags;
            $http.put('/api/blog/post/'+ post._id + '/status',{title: post.title,
                content: post.content,tags:tags,status:status})
                .success(function(data) {
                    $location.path('/posts');
                }).error(function(err) {
                    console.log("Unable to post article" + err);
                });
        };

        $scope.addComment = function(comment){
            $http.post('/api/blog/post/'+ $routeParams.id + '/comment',{comment: comment})
                .success(function(data) {
                    $location.path('/posts');
                }).error(function(err) {
                    console.log("Unable to post article" + err);
                });
        };

        $scope.addTag = function(){
           $scope.tags = $scope.post.tags;
        };

        $scope.subscribe = function(){
            $http.post('/api/blog/subscribe',{email: $scope.blog.subscriptionEmail})
                .success(function(data) {
                   $alert({title: 'Subscription', content: 'You have been subscribed for Career Myntra blog', placement: 'top', type: 'success', show: true,duration: 3});

                }).error(function(err) {
                    $alert({title: 'Subscription', content: 'Unable to subscribe for Career Myntra blog..Please try again', placement: 'top', type: 'error', show: true,duration: 3});
                });
        };

        $scope.getAllPosts = function(){
            var postId = $routeParams.id;
            if (postId == undefined){
                $http.get('/api/blog/posts')
                    .success(function(data) {
                        $scope.articles = data;
                    }).error(function(err) {
                        console.log("Unable to Retrieve blog" + err);
                    });
            }else{
                $location.path('/posts/'+postId);
                $http.get('/api/blog/posts/' + postId)
                    .success(function(data) {
                        $scope.articles = data;
                        console.log(JSON.stringify(data));
                    }).error(function(err) {
                        console.log("Unable to get articles" + err);
                    });
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

        $scope.searchPosts = function(searchStr){
            var postId = $routeParams.id;
            $http.get('/api/blog/posts/search?id=' + searchStr)
                .success(function(data) {
                    $scope.articles = data;
                }).error(function(err) {
                    console.log("Unable to get articles" + err);
                });
        };

        $scope.searchPosts = function(searchStr){
            var postId = $routeParams.id;
            $http.get('/api/blog/posts/search?id=' + searchStr)
                .success(function(data) {
                    $scope.articles = data;
                }).error(function(err) {
                    console.log("Unable to get articles" + err);
                });
        };

});
