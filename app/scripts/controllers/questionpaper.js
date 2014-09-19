'use strict';

angular.module('pupilsboardApp')
  .controller('QuestionpaperCtrl', function ($scope,$http,$location,$routeParams,$modal,$alert) {
            $scope.questionPaper = null;
            $scope.curQuestionIndex = 0;

            $scope.sectionDetails = {};
            $scope.curIndex = 0;
            $scope.curSection = {};
            $scope.totalTime = 0;

            var countMap = new Object();
            countMap['nonvisited'] = [];
            countMap['answered'] = [];
            countMap['marked'] = [];
            countMap['unanswered'] = [];
            $scope.countMap = countMap;

            $scope.Math = window.Math

            $scope.changeSection = function($event,section){
                console.log('changing from ' + $scope.curSection.name + 'to: ' + $scope.section.name);
                if ($scope.curSection && !$scope.section.isOver){
                    $scope.curSection.isOver = true;//Section over can't do anything with this now
                    $scope.curSection = $scope.section;
                    $scope.startTime(true,0,0);
                }else{
                    console.log($event);
                    console.log('Section is already over');
                }
            };

         $scope.startTest = function(){
             $location.path('/questionPaper/'+ $routeParams.id + '/start'); //use $location.path(url).replace() if you want to replace the location instead
         };

        $scope.loadTest = function(){

            if ($routeParams.samplePaper){

                $http.get('/api/questionPaper/sample?tags='+ $routeParams.topic).error(function(err){
                    console.log('Error while getting topics ' + err);
                })
                .success(function(data){
                    $scope.initializeQuestionPaper(data);
                });
            }else{
                console.log("Loading paper");
                $http.get('/api/questionPaper/'+ $routeParams.id).error(function(err){
                    console.log('inside error');
                })
                .success(function(data){
                        $scope.initializeQuestionPaper(data);
                });
            }
        };

        $scope.initializeQuestionPaper = function(data){
            $scope.questionPaper = data;
            var totalTime = 0;
            angular.forEach(data.sections,function(section){
                totalTime += section.totalTime;
                var count = 0 ;
                angular.forEach(section.questions,function(question){
                    countMap['unanswered'].push(question._id);
                    if (count != 0){
                        countMap['nonvisited'].push(question._id);
                    }
                    count++;
                });
                $scope.curSection=section;

            });
            $scope.totalTime = totalTime;
            $scope.startTime(true,0,0,0);
            console.log('Total time of test is:' + totalTime);
        };

        $scope.loadAnswerSheet = function(){
            console.log("Loading paper");
            $http.get('/api/candidate/answerSheets/'+ $routeParams.id).error(function(err){
                console.log('inside error');
            })
            .success(function(data){
                $scope.questionPaper = data;
                $scope.curSection=data.sections[0];
                console.log('section questions',$scope.curSection.questions.length);
            });
        };

        $scope.loadInstructions = function(){
            $http.get('/api/questionPaper/'+ $routeParams.id + '/instruction').error(function(err){
                console.log('inside error');
            })
            .success(function(data){
                $scope.instruction = data;
            });
        };

        $scope.selectQuestionOption = function(selectedQuestion,c){
            angular.forEach(selectedQuestion.choices, function (c) {
                c.isUserAnswer = false;
            });

            c.isUserAnswer = true;
            console.log(JSON.stringify(selectedQuestion));
        };

        $scope.finish = function(){
            console.log("Finishing paper" + JSON.stringify($scope.questionPaper));
            //var selectedSection = $scope.selectedSection;
            $http.post('/api/answerSheet',JSON.stringify($scope.questionPaper)).error(function(err){
                console.log('error while saving paper...');
            })
            .success(function(data){
                console.log('Paper finished successfully');
                $location.path('/paperCompleted');
            });
        };

        $scope.saveComment = function(question){
            //var selectedSection = $scope.selectedSection;
            console.log("Saving comment" + $scope.curQuestionIndex);
            ///api/answerSheet/:id/question/:questionId/comment
            $http.put('/api/answerSheet/' + $scope.questionPaper._id + '/question/' + question._id + '/comment',{comment: question.comment}).error(function(err){
                console.log('error while saving paper...');
            })
            .success(function(data){
                console.log('Paper finished successfully');
            });
        };

        $scope.clickPagination = function(index){
            $scope.curQuestionIndex = index;
        };

        $scope.startTime = function(firstTime,h,m,s) {
            //var h,m;
            if (firstTime){
                h = $scope.totalTime/60;//(section.totalTime/60);
                h = parseInt(h);
                m = parseInt($scope.totalTime - h*60);//section.totalTime - h*60;
                m = Math.max(m - 1,0);
                if (m == 0){
                    h = h-1;
                    m = 59;
                }
                s = 59; //Initially start with
            } else{
                if (s >= 1){
                    s = s - 1;
                }
                else if (m >= 1){
                    m = m - 1;
                    s = 59; //Start seconds with 60 again
                }else if (h >= 1){
                    h = h -1;
                    m = 59;
                    s = 59;
                }
            }
            if (h == 0 && (m-0) == 0 && (s-0) == 0){
                //section.isOver = true;
                var myAlert = $alert({title: 'Time UP', content: 'Time is UP..Paper will be submitted', placement: 'top', type: 'warning', show: true,duration: 3});
                $scope.finish();
            }else{
                // add a zero in front of numbers<10
                m = $scope.checkTime(m);
                s = $scope.checkTime(s);
                document.getElementById("timer").innerHTML = h+ ":" + m + ":" + s;
                var t = setTimeout(function(){$scope.startTime(false,h,m,s)}, 1000);
            }
        };

        $scope.checkTime = function (i){
            if (i<10 && i.toString().length < 2) {
                i = "0" + i;
            }
            return i;
        };

        $scope.emitEvent = function(form){
            $http.post('/api/emitEvent').error(function(err){
                console.log('error while saving paper...');
            })
            .success(function(data){
            });
        };

        $scope.filterAnswered = function(section){
            var count = 0;
            for (var i = 0; i < section.questions.length; i++){
                var question = section.questions[i];
                var index = countMap['answered'].indexOf(question._id);
                if (index == -1){
                    count++;
                }
            }
            return count;
        };

        $scope.setCurrentIdx = function(idx){
            $scope.curQuestionIndex = idx;
            $scope.markVisited($scope.curSection.questions[idx]);
        };

        $scope.movePrev = function(){
            $scope.curQuestionIndex--;
        };

        $scope.moveNext = function(){
            if ($scope.curQuestionIndex < $scope.questionPaper.sections[0].questions.length - 1){
                $scope.curQuestionIndex++;
            }
        };

//        $scope.selectCurrentQuestion = function(index){
//            $scope.curQuestionIndex = index;
//        };

        $scope.markAnswered = function(question){
            var index = countMap['unanswered'].indexOf(question._id);
            $scope.markVisited(question);
            if (index != -1){
                countMap['unanswered'].splice(index,1);
            }
            index = countMap['answered'].indexOf(question._id);
            if (index == -1){
                countMap['answered'].push(question._id);
            }
        };

        $scope.markVisited = function(question){
            //var question = $scope.curSection.questions[idx];
            var index = countMap['nonvisited'].indexOf(question._id);
            if (index != -1){
                countMap['nonvisited'].splice(index,1);
            }
        };

        $scope.markForReview = function(question){
            var index = countMap['marked'].indexOf(question._id);
            if (index == -1){
                countMap['marked'].push(question._id);
            }
        };
  });
