'use strict';

angular.module('pupilsboardApp')
  .controller('QuestionpaperCtrl', function ($scope,$http,$location,$routeParams) {
            $scope.questionPaper = null;
            $scope.curQuestionIndex = 0;

            $scope.sectionDetails = {};
            $scope.curIndex = 0;
            $scope.curSection = {};
            $scope.totalTime = 100;

            $scope.changeSection = function($event,section){
                console.log('changing from ' + $scope.curSection.name + 'to: ' + $scope.section.name);
                if ($scope.curSection && !$scope.section.isOver){
                    $scope.curSection.isOver = true;//Section over can't do anything with this now
                    $scope.curSection = $scope.section;
                    $scope.startTime($scope.curSection,true,0,0);
                }else{
                    console.log($event);
                    console.log('Section is already over');
                }
            };

         $scope.startTest = function(){
             $http.get('/api/questionPaper/load/'+ $scope.authKey.toString()).error(function(err,data){
                    console.log('inside error');
                 })
                 .success(function(data){
                    console.log('inside error');
                    $location.path('/questionPaper/'+data.questionPaperId); //use $location.path(url).replace() if you want to replace the location instead
                 });
         };

        $scope.loadTest = function(){
            console.log("Loading paper");
            $http.get('/api/questionPaper/'+ $routeParams.id).error(function(err){
                console.log('inside error');
            })
            .success(function(data){
                console.log('Paper loaded successfully');
                $scope.questionPaper = data;
                var totalTime = 0;
                angular.forEach(data.sections,function(section){
                    totalTime += section.totalTime;
                    console.log(totalTime);
                });
                $scope.totalTime = totalTime;
            });
        };

        $scope.selectQuestionOption = function(selectedQuestion,c){
            angular.forEach(selectedQuestion.choices, function (c) {
                c.isUserAnswer = false;
            });

            c.isUserAnswer = true;
            console.log(JSON.stringify(selectedQuestion));
        };

        $scope.finish = function(form){
            console.log("Finishing paper" + JSON.stringify($scope.questionPaper));
            var selectedSection = $scope.selectedSection;
            $http.post('/api/answerSheet',JSON.stringify($scope.questionPaper)).error(function(err){
                console.log('error while saving paper...');
            })
            .success(function(data){
                console.log('Paper finished successfully');
                $location.path('/paperCompleted');
            });
        };

        $scope.clickPagination = function(index){
            console.log('paginationn clicked');
            console.log($scope.curQuestionIndex);
            $scope.curQuestionIndex = index;
            console.log($scope.curQuestionIndex);
        };

        $scope.startTime = function(section,firstTime,h,m) {
            //var h,m;
            if (firstTime){
                h = $scope.totalTime/60;//(section.totalTime/60);
                h = h.toFixed(0);
                m = $scope.totalTime - h*60;//section.totalTime - h*60;
            } else{
                if (m >= 1){
                    m = m - 1;
                }else{
                    h = h -1;
                    m = 59;
                }
            }
            if (h == 0 && m === 0){
                section.isOver = true;
                $scope.finish($scope.form);
            }else{
                // add a zero in front of numbers<10
                m = $scope.checkTime(m);
                document.getElementById("timer").innerHTML = h+ ":" + m;
                var t = setTimeout(function(){$scope.startTime(section,false,h,m)}, 1000);
            }
        };

        $scope.checkTime = function (i){
            if (i<10) {
                i = "0" + i;
            }
            return i;
        };

        $scope.saveQuestion = function (question){
            $http.post('/api/question',JSON.stringify(question)).error(function(err){
                console.log('error while saving paper...');
            })
            .success(function(data){
                console.log('Paper finished successfully');
                $location.path('/paperCompleted');
            });
        };

        $scope.emitEvent = function(form){
            $http.post('/api/emitEvent').error(function(err){
                console.log('error while saving paper...');
            })
            .success(function(data){
            });
        };

        // setup editor options
        $scope.editorOptions = {
            language: 'en',
            uiColor: '#000000'
        };
  });
