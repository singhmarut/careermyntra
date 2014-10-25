'use strict';

angular.module('pupilsboardApp')
  .controller('SignupCtrl', function ($scope, Auth, $location,$alert,$routeParams,$http) {

    $scope.user = {};
    $scope.errors = {};

    if($routeParams.emailId != 'undefined'){
        $scope.user.email = $routeParams.emailId;
    }

    $scope.register = function(form) {
      $scope.submitted = true;
  
      if(form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
         var myAlert = $alert({title: 'Registration Complete', content: 'An email has been sent to your emailid.\n Please verify your email address', placement: 'top', type: 'info', show: true,duration:3});
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

        $scope.sendInvitation = function(form) {
            if(form.$valid) {
                $http.post('/api/users/invite'+ "?referredEmail=" + $scope.user.email).error(function(err){
                    var myAlert = $alert({title: 'Error sending Invitation', content: 'Unable to send invitation.\n Please try again!!', placement: 'top', type: 'warn', show: true,duration:3});
                })
                .success(function(data){
                    var myAlert = $alert({title: 'Registration Complete', content: 'An email has been sent to your emailid.\n Please verify your email address', placement: 'top', type: 'info', show: true,duration:3});
                });
            }
        };
  });