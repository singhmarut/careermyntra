'use strict';

angular.module('pupilsboardApp')
    .controller('ContactCtrl', function ($scope, $location,$http) {
        $scope.user = {};
        $scope.errors = {};

        $scope.register = function(form) {
            console.log('inside register');
            $scope.submitted = true;

            if(form.$valid) {
                var postData = JSON.stringify(form);
                $http.post('/api/registerForNewsLetter',{email: $scope.email}).error(function(err){
                    console.log('error while registering for newsletter...');
                })
                .success(function(data){
                    console.log('Paper finished successfully');
                    alert('Registered for Newsletter');
                });
            }
        };

    });/**
 * Created by Marut on 29/06/14.
 */
