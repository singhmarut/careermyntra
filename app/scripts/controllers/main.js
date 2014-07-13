'use strict';

angular.module('pupilsboardApp')
  .controller('MainCtrl', function ($scope, $http,$modal) {
//    $http.get('/api/awesomeThings').success(function(awesomeThings) {
//      $scope.awesomeThings = awesomeThings;
//    });

        $scope.signup = function() {
            var myAlert = $modal({scope: $scope,title: 'Sign Up',html:true, contentTemplate: 'partials/signup', placement: 'top', type: 'warning', show: true});
        };
  });
