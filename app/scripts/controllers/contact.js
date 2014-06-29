'use strict';

angular.module('pupilsboardApp')
    .controller('ContactCtrl', function ($scope, $location,$http) {
        $scope.user = {};
        $scope.errors = {};

        $scope.register = function(form) {
            console.log('inside login');
            $scope.submitted = true;

            if(form.$valid) {

            }
        };

    });/**
 * Created by Marut on 29/06/14.
 */
