'use strict';

angular.module('pupilsboardApp')
  .controller('MainCtrl', function ($scope, $http,$modal,$location) {
//    $http.get('/api/awesomeThings').success(function(awesomeThings) {
//      $scope.awesomeThings = awesomeThings;
//    });

        $scope.subjects=['Polity'];

        $scope.topicModal = $modal({scope:$scope,title: 'Select Topic',
            contentTemplate: 'partials/platform/selectTopics.html', show: false});

        $scope.signup = function() {
            var myAlert = $modal({scope: $scope,title: 'Sign Up',html:true, contentTemplate: 'partials/signup', placement: 'top', type: 'warning', show: true});
        };

        $scope.selectSubjects = function(){
            console.log('select subjects');
            $location.path('/subjects');
        };

//        var subjectModal = $modal({title: 'Select Subject',
//            template: 'partials/platform/selectSubjects.html', show: false});
//
//        $scope.showSubjects = function() {
//            subjectModal.$promise.then(subjectModal.show);
//        };
//
//        $scope.dismissModal = function() {
//            subjectModal.hide();
//        };
//
//        $scope.getTopics = function(subject){
//            console.log('select topics for ' + subject);
//            $location.path('/subject/' + subject + '/topics');
//        };
  });
