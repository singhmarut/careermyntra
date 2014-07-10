'use strict';

angular.module('pupilsboardApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth,$http,$modal) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];


    $scope.user = {};
    $scope.errors = {};
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
    };

    $scope.login = function() {
        var myAlert = $modal({scope: $scope,title: 'Login', contentTemplate: 'partials/loginmodal', placement: 'top', type: 'warning', show: true});
    };


    $scope.loginToPortal = function(form) {
        console.log('inside login');
        $scope.submitted = true;

        if(form.$valid) {
            Auth.login({
                email: $scope.user.email,
                password: $scope.user.password
            })
            .then( function() {
                // Logged in, redirect to home
                $location.path('/');
            })
            .catch( function(err) {
                err = err.data;
                $scope.errors.other = err.message;
            });
        }
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };

//    $scope.createDummyPaper = function() {
//        console.log('creating dummy paper...');
//        $http.post('/api/createDummyPaper').error(function(err,data){
//            console.log('inside error');
//            $location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
//        })
//        .success(function(err,data){
//                console.log('inside error');
//                $location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
//        });
//    };
  });
