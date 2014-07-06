'use strict';

angular.module('pupilsboardApp')
    .controller('CreatequestionpaperCtrl', function ($scope,$http,$location,$routeParams,$modal,$alert) {

        $scope.questionPaper = new Object();
        $scope.questionPaper.sections = [];
        var newSection = new Object();
        $scope.questionPaper.sections[0] = newSection;
        newSection.questionIds = [];
            $scope.myData = [{tag: "GS",age:30},
            {tag: "GS",age:30},
            {tag: "PHYSICS",age:30},
            {tag: "CHEMISTRY",age:30}];
        //editableCellTemplate:self.editableCellTempate ,enableCellEdit:true
        $scope.gridOptions = { data: 'myData',
            columnDefs: [{ field: 'tag', displayName: 'Tag Name', width: 90 },
                { field: 'age', displayName: 'Select',cellClass: 'ageCell', headerClass: 'ageHeader',
                    cellTemplate: '<a ng-input="COL_FIELD" ng-click="selectQuestions(row)" data-animation="am-fade-and-slide-top" ng-model="COL_FIELD">Select Questions</a>' } ]};

        $scope.selectQuestions = function(row){

            $scope.tag = row.entity.tag;
            var myOtherModal = $modal({scope: $scope, contentTemplate: 'partials/questionPaper/selectQuestions.html', show: false});
            $http.get('/api/questions/tag/' + row.entity.tag).error(function(err){
                console.log('error while fetching questions...');
            })
            .success(function(data){
                console.log('Questions loaded successfully');
                //$scope.questions = data;
                $scope.questions = data;
                console.log(data);
                $scope.selectQuestionGridOptions = { data: 'questions',
                    columnDefs: [
                        { field: 'content', displayName: 'Text'},
                        { field: '_id', displayName: 'Id', width: 90,cellTemplate: '<input type="text" ng-input="COL_FIELD" ng-model="COL_FIELD" disabled/>' },
                        { field: 'selected',displayName: 'Select',width: 90,cellTemplate: '<input type="checkbox" ng-input="COL_FIELD" ng-model="COL_FIELD"/>' }]};

                $scope.showModal();
            });

            $scope.showModal = function() {
                myOtherModal.$promise.then(myOtherModal.show);
            };

            $scope.dismissModal = function() {
                console.log('dismiss');
                myOtherModal.hide();
            };

            $scope.confirmQuestions = function() {
                console.log('selecting questions..' + $scope.tag);
                var data = $scope.selectQuestionGridOptions.ngGrid.data;
                $scope.questionPaper.sections[0].name = $scope.sectionName;
                $scope.questionPaper.sections[0].duration = $scope.duration;
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].selected){
                        $scope.questionPaper.sections[0].questionIds.push(data[i]._id);
                    }
                };
                console.log('paper is' + JSON.stringify($scope.questionPaper));
                myOtherModal.hide();
            };

            $scope.createPaper = function() {
                $scope.questionPaper.name = $scope.paperName;
                $scope.questionPaper.invitation = $scope.invitationType.value;
                JSON.stringify($scope.questionPaper);
                $http.post('/api/questionPaper',JSON.stringify($scope.questionPaper)).error(function(err){
                    var myAlert = $modal({title: 'Question Paper', content: 'Error while creating paper '+ err, placement: 'top', type: 'error', show: true,duration: 2});
                })
                .success(function(data){
                        var myAlert = $modal({title: 'Question Paper', content: 'Question Paper Created', placement: 'top', type: 'info', show: true,duration: 2});
                });
            };
        }

});
