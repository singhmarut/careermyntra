'use strict';

angular.module('pupilsboardApp')
  .controller('TestmanageCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
   /* $scope.takeTest = function(){
        $http.get('/api/questionPaper?authKey='+ $scope.authKey).error(function(err,data){
            console.log('inside error');
            $location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead
        }).success(function(err,data){
                console.log('inside error');
                $location.path('/questionPaper'); //use $location.path(url).replace() if you want to replace the location instead

        });
    };*/
  });
