'use strict';

angular.module('pupilsboardApp')
    .controller('SearchCtrl', function ($scope,$http,$location,$routeParams,$modal,$alert) {
        $scope.questionPaper = null;
        $scope.curQuestionIndex = 0;

        $http.get('/api/blog/posts/refreshIndex').error(function(err){
            console.log('Unable to refresh indexes');
        });
});