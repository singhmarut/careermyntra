'use strict';

angular.module('pupilsboardApp')
    .controller('CreatequestionpaperCtrl', function ($scope,$http,$location,$routeParams,$modal,$alert) {


        $scope.questionPaper = {};
        $scope.questionPaper.instruction="All Questions are compulsory";
        $scope.questionPaper.sections = [];
        $scope.paperName = '';
        var newSection = {};
        newSection.questionIds = [];
        $scope.questionPaper.sections[0] = newSection;

        $scope.myData = [];
        $scope.search = {};
        $scope.search.tags = [];
        $scope.duration = 180;
        $scope.question = {};

        $scope.sectionName = 'General Studies';
        $scope.invitations = [
            {key:'Open For All', value:'OPEN_FOR_ALL'},
            {key:'By Invitation', value:'BY_INVITATION'}
        ];
        $scope.invitationType = $scope.invitations[0];

        $scope.$on('questionChanged', function (event, question) {
            $scope.question = question;
            console.log(question.content); // 'Some data'
        });

        $scope.confirmQuestions = function() {
            $scope.questionPaper.sections[0].questionIds.push($scope.question._id);
        };

//        $scope.getAllTags = function(){
//            $http.get('/api/questions/tags').error(function(err){
//                console.log('error while fetching tags...');
//            })
//                .success(function(data){
//                    $scope.allTags = data;
//                    angular.forEach(data,function(tag){
//                        $scope.myData = [];
//                        $scope.myData.push({tag:tag.name,age:30});
//                    });
//                });
//        };
//
//        $scope.addTagForSearch = function(){
//            if (angular.isObject($scope.search.tag)){
//                var tags = $scope.search.tags;
//                var isPresent = false;
//                for (var idx = 0; idx < tags.length; idx++) {
//                    var findTag = tags[idx];
//                    if ((findTag == $scope.search.tag.name)){
//                        isPresent = true;
//                        break;
//                    }
//                }
//                if (!isPresent){
//                    tags.push($scope.search.tag.name);
//                    $scope.search.tag = '';
//                }
//            }
//        };
//        $scope.removeTagFromSearch = function(tag){
//            var tags = $scope.search.tags;
//            var isPresent = false;
//            for (var idx = 0; idx < tags.length; idx++) {
//                var findTag = tags[idx];
//                if ((findTag == tag)){
//                    tags.splice(idx,1);
//                }
//            }
//        };

        //editableCellTemplate:self.editableCellTempate ,enableCellEdit:true
        $scope.gridOptions = { data: 'myData',
            columnDefs: [{ field: 'tag', displayName: 'Tag Name', width: 90 },
                { field: 'age', displayName: 'Select',cellClass: 'ageCell', headerClass: 'ageHeader',
                    cellTemplate: '<a ng-input="COL_FIELD" ng-click="selectQuestions(row)" data-animation="am-fade-and-slide-top" ng-model="COL_FIELD">Select Questions</a>' },
                { field: 'count', displayName: 'Select',cellClass: 'ageCell', headerClass: 'ageHeader',
                    cellTemplate: '<input type="text" ng-model="COL_FIELD">Count</a>' }
            ]};

        $scope.selectQuestions = function(row){

            var tag = '';
            var myOtherModal = $modal({scope: $scope, contentTemplate: 'partials/questionPaper/selectQuestions.html', show: false});
            var filterUrl = "?";
            if ($scope.search.startDate != undefined && $scope.search.endDate != undefined){
                filterUrl += "&startDate=" + $scope.search.startDate + "&endDate=" + $scope.search.endDate;
            }
            if ($scope.search.endDate != undefined){
                filterUrl += "&endDate=" + $scope.search.endDate;
            }
            if ($scope.search.text != undefined){
                filterUrl += "&text=" + $scope.search.text;
            }
            for (var idx =0;idx< $scope.search.tags.length; idx++){
                filterUrl += "&tag=" + $scope.search.tags[idx];
            }
//            if ($scope.search.tag != undefined){
//                tag = $scope.search.tag.name;
//            }
            filterUrl += "&status=PUBLISHED";
            $http.get('/api/questions/filter/' + filterUrl).error(function(err){
                console.log('error while fetching questions...');
            })
            .success(function(data){
                console.log('Questions loaded successfully');
                $scope.questions = data;
                angular.forEach(data,function(question){
                    question.selected = false;
                });
                $scope.selectQuestionGridOptions = { data: 'questions',
                    columnDefs: [
                        { field: 'content', displayName: 'Text',cellTemplate: '<p ng-bind-html="COL_FIELD"></p>' },
                        { field: '_id', displayName: 'Id', width: 90},
                        { field: 'selected',displayName: 'Select',width: 90,cellTemplate: '<input type="checkbox" ng-input="COL_FIELD" ng-model="COL_FIELD"/>' }]};

                $scope.showModal();
            });

            $scope.showModal = function() {
                myOtherModal.$promise.then(myOtherModal.show);
            };

            $scope.dismissModal = function() {
                myOtherModal.hide();
            };


            $scope.confirmQuestions = function() {
                var data = $scope.selectQuestionGridOptions.ngGrid.data;

                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i].selected && !$scope.isInArray($scope.questionPaper.sections[0].questionIds,data[i]._id)){
                        $scope.questionPaper.sections[0].questionIds.push(data[i]._id);
                    }else if(!data[i].selected){
                        $scope.removeElement($scope.questionPaper.sections[0].questionIds,data[i]._id);
                    }
                };
                myOtherModal.hide();
            };
        };

//            $http.get('/api/questions/tag/' + row.entity.tag).error(function(err){
//                console.log('error while fetching questions...');
//            })
//            .success(function(data){
//                console.log('Questions loaded successfully');
//                //$scope.questions = data;
//                //$scope.questions = data;
//                console.log(data);
//                $scope.selectQuestionGridOptions = { data: 'questions',
//                    columnDefs: [
//                        { field: 'content', displayName: 'Text',cellTemplate: '<p ng-bind-html="COL_FIELD"></p>' },
//                        { field: '_id', displayName: 'Id', width: 90},
//                        { field: 'selected',displayName: 'Select',width: 90,cellTemplate: '<input type="checkbox" ng-model="COL_FIELD" ng-checked="isQuestionSelected(row)"/>' }]};
//
//                $scope.showModal();
//            });



        $scope.isQuestionSelected = function(row){
            var selected = $scope.isInArray($scope.questionPaper.sections[0].questionIds,row.entity._id);
            return selected;
        };

        $scope.markSelect = function(row){
            var data = $scope.selectQuestionGridOptions.ngGrid.data;
            for (var idx =0 ; idx < data.length; idx++){
                if (data[idx] === data.entity._id){
                    data[idx].selected = true;
                    break;
                }
            }
        };

        $scope.isInArray = function(arr,elem){
            var selected = false;
            angular.forEach(arr, function(arrElem){
                if (elem == arrElem){
                    selected = true;
                }
            });
            return selected;
        };

        $scope.removeElement = function(arr,elem){
            var selected = false;
            var idx = 0;
            for (var idx =0 ; idx < arr.length; idx++){
                if (arr[idx] === elem){
                    arr.splice(idx,1);
                    break;
                }
            }
        };

        $scope.addInstruction = function(){
            var instructionModal = $modal({scope: $scope, contentTemplate: 'partials/questionPaper/addInstruction.html', title: 'Question Paper', placement: 'top', type: 'info', show: true});

            $scope.saveModal = function(instruction) {
                console.log(instruction);
                $scope.questionPaper.instruction = instruction;
                instructionModal.hide();
            };

            $scope.dismissModal = function() {
                instructionModal.hide();
            };

        };

        $scope.createPaper = function() {
            $scope.questionPaper.name = $scope.paperName;
            $scope.questionPaper.sections[0].name = $scope.sectionName;
            $scope.questionPaper.sections[0].totalTime = $scope.duration;
            $scope.questionPaper.invitation = $scope.invitationType.value;
            console.log(JSON.stringify($scope.questionPaper));

            $http.post('/api/questionPaper',JSON.stringify($scope.questionPaper)).error(function(err){
                var myAlert = $modal({title: 'Question Paper', content: 'Error while creating paper '+ err, placement: 'top', type: 'error', show: true});
            })
            .success(function(data){
                var myAlert = $modal({title: 'Question Paper', content: 'Question Paper Created', placement: 'top', type: 'info', show: true});
            });
        };

    });
