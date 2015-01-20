/*
 * Copyright (c) 2015. All rights reserved.
 *
 *   This file is created and owned by careermyntra. software licensed to you under enterprise Software License Agreement (the "License")
 *   You may not use this file except in compliance with the License. For licensing contact: support@careermyntra.com
 *
 *   Unauthorized reverse engineering, disassembly or modifications prohibited.
 *   CareerMyntra Confidential
 */

'use strict';

var app = angular.module('pupilsboardApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ngCkeditor',
        'ngGrid',
        'mgcrea.ngStrap',
        'mgcrea.ngStrap.modal',
        'mgcrea.ngStrap.aside',
        'ngAnimate',
        'angularFileUpload',
        'angular-socialshare'
    ])
    .config(function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/main ',
                controller: 'NavbarCtrl'
            })
            .when('/login', {
                templateUrl: 'partials/login',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'partials/signup',
                controller: 'SignupCtrl'
            })
            .when('/invite', {
                templateUrl: 'partials/invite',
                controller: 'SignupCtrl'
            })
            .when('/logout', {
                templateUrl: 'partials/login',
                controller: 'logout()'
            })
            //Show all subjects
            .when('/take-test/subjects', {
                templateUrl: 'partials/platform/selectSubjects',
                controller: 'SubjectCtrl'
            })
            //Get sample quizzes for selected subject
            .when('/take-test/subject/:subject/quizzes', {
                templateUrl: 'partials/platform/categoryPapers',
                controller: 'SubjectCtrl'
            })
            .when('/take-test/:category/list', {
                templateUrl: 'partials/platform/categoryPapers',
                controller: 'QuestionpaperCtrl'
            })
            .when('/subjects/:subject/topics', {
                templateUrl: 'partials/platform/selectSingleSubject',
                controller: 'SubjectCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'partials/dashboard',
                controller: 'AccountCtrl',
                authenticate: true
            })
            .when('/createPaper', {
                templateUrl: 'partials/questionPaper/createPaper',
                controller: 'CreatequestionpaperCtrl',
                authenticate: true
            })
            .when('/cloneQuestion/:id', {
                templateUrl: 'partials/questions/cloneQuestion',
                controller: 'QuestionCtrl',
                authenticate: true
            })
            .when('/uploadQuestions', {
                templateUrl: 'partials/questions/uploadQuestions',
                controller: 'QuestionCtrl',
                authenticate: true
            })
            .when('/blog', {
                templateUrl: 'partials/blog/blog',
                controller: 'BlogCtrl'
            })
            .when('/posts', {
                templateUrl: 'partials/blog/allPosts',
                controller: 'BlogCtrl'
            })
            .when('/posts/:id', {
                templateUrl: 'partials/blog/singlePost',
                controller: 'BlogCtrl'
            })
            .when('/editPosts/:id', {
                templateUrl: 'partials/blog/editPost',
                controller: 'BlogCtrl'
            })
            .when('/newPost', {
                templateUrl: 'partials/blog/newPost',
                controller: 'BlogCtrl',
                authenticate: true
            }).when('/refreshIndex', {
                template: ' ',
                controller: 'SearchCtrl',
                authenticate: true
            })
//            .when('/takeTest', {
//                templateUrl: 'partials/testStart',
//                controller: 'QuestionpaperCtrl',
//                authenticate: true
//            })
            .when('/createDummyPaper', {
                templateUrl: 'partials/dummyPaper',
                controller: 'NavbarCtrl',
                authenticate: true
            })
            .when('/viewQuestions', {
                templateUrl: 'partials/questions/viewQuestions',
                controller: 'QuestionCtrl',
                authenticate: true
            })
            .when('/addQuestions', {
                templateUrl: 'partials/questions/matchingQuestion',
                controller: 'QuestionCtrl'
            })
            .when('/tags', {
                templateUrl: 'partials/admin/tags',
                controller: 'TagsCtrl'
            })
            .when('/questions/summary', {
                templateUrl: 'partials/admin/questionSummary',
                controller: 'TagsCtrl'
            })
//        .when('/questions/view/:tag', {
//            templateUrl: 'partials/searchQuestions',
//            controller: 'QuestionCtrl',
//            authenticate: true
//        })
//            .when('/questionPaper', {
//                templateUrl: 'partials/questionPaper/questionPaper-modified',
//                controller: 'QuestionpaperCtrl'
//            })
            .when('/questionPaper/:id', {
                templateUrl: 'partials/questionPaper/instructions',
                controller: 'QuestionpaperCtrl',
                authenticate: true
            })

            .when('/answerSheet/:id', {
                templateUrl: 'partials/candidate/answerSheet',
                controller: 'QuestionpaperCtrl',
                authenticate: true
            })
            .when('/samplePaper', {
                templateUrl: 'partials/questionPaper/questionPaper-modified',
                controller: 'QuestionpaperCtrl'
            })
            .when('/questionPaper/:id/start', {
                templateUrl: 'partials/questionPaper/questionPaper',
                controller: 'QuestionpaperCtrl',
                authenticate: true
            })
            .when('/paper/report/:id', {
                templateUrl: 'partials/candidate/',
                controller: 'QuestionpaperCtrl',
                authenticate: true
            })
            .when('/paperCompleted', {
                templateUrl: 'partials/questionPaper/paperSuccess',
                authenticate: true
            })
            .when('/myDashboard', {
                templateUrl: 'partials/candidate/candidateDashboard',
                authenticate: true
            })
            .when('/answerSheet/:passKey', {
                templateUrl: 'partials/candidate/candidateAnswerSheet',
                authenticate: true
            })
            .when('/skills', {
                templateUrl: 'partials/skillHierarchy',
                controller: 'SkillsCtrl',
                authenticate: true
            })
//            .when('/tilesDemo', {
//                templateUrl: 'partials/demo/tilesdemo'
//                //controller: 'SkillsCtrl',
//                //authenticate: true
//            })
            .when('/dummyPaper', {
                templateUrl: 'partials/questionPaper/dummyPaper'
                //controller: 'SkillsCtrl',
                //authenticate: true
            })
            .when('/tree', {
                templateUrl: 'partials/hierarchyTreed3js',
                controller: 'SkillsCtrl',
                authenticate: true
            })
            .when('/api/emitEvent', {
                templateUrl: 'partials/testStart',
                controller: 'QuestionpaperCtrl|function()='
            })
            .when('/feedback', {
                templateUrl: 'partials/feedback/feedback',
                controller: 'ContactCtrl'
            })
            .when('/contacUs', {
                templateUrl: 'partials/feedback/contactUs',
                controller: 'ContactCtrl'
            })
            .when('/aboutUs', {
                templateUrl: 'partials/feedback/aboutUs',
                controller: 'ContactCtrl'
            })
            .when('/registerNewsLetter', {
                templateUrl: 'partials/feedback/feedback',
                controller: 'ContactCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);

        // Intercept 401s and redirect you to login
        $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
            return {
                'responseError': function(response) {
                    if(response.status === 401) {
                        $location.path('/login');
                        return $q.reject(response);
                    }
                    else {
                        return $q.reject(response);
                    }
                }
            };
        }]);
    })
    .run(function ($rootScope, $location, Auth) {

        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$routeChangeStart', function (event, next) {
            console.log("event" + event);
            if (next.authenticate && !Auth.isLoggedIn()) {
                $location.path('/login');
            }
        });

        $rootScope.$on('submitSamplePaper', function(event, args) {
            $rootScope.$broadcast('handleSubmitSamplePaper',args);

            //$rootScope.$broadcast('helloEvent', 'Sathyalog');
           // $rootScope.$broadcast('questionChanged', args);
        });
    });

