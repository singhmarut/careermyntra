'use strict';

angular.module('pupilsboardApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth,$http) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Settings',
      'link': '/settings'
    }];
    
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/');
      });
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
