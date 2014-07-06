'use strict';

angular.module('pupilsboardApp')
    .controller('ContactCtrl', function ($scope, $location,$http,$alert,$modal) {
        $scope.user = {};
        $scope.errors = {};

        $scope.register = function(form) {
            console.log('inside register');
            if(form.$valid) {
                var postData = JSON.stringify(form);
                $http.post('/api/registerForNewsLetter',{email: form.email}).error(function(err){
                    console.log('error while registering for newsletter...');
                })
                .success(function(data){
                    console.log('Paper finished successfully');
                    alert('Registered for Newsletter');
                });
            }
        };

        $scope.sendFeedback = function() {
            $http.post('/api/sendFeedback',{email: $scope.email,feedback: $scope.feedback}).error(function(err){
                console.log('error while registering for newsletter...');
            })
            .success(function(data){
                var myModal = $modal({title: 'ThankYou!!', content: 'Your feedback has been recieved.', show: true});
            });
        };

    });/**
 * Created by Marut on 29/06/14.
 */
