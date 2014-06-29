'use strict';

angular.module('pupilsboardApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngCkeditor'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
        .when('/dashboard', {
            templateUrl: 'partials/dashboard',
            controller: 'AccountCtrl'
        })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/takeTest', {
        templateUrl: 'partials/testStart',
        controller: 'QuestionpaperCtrl'
      })
        .when('/createDummyPaper', {
            templateUrl: 'partials/dummyPaper',
            controller: 'NavbarCtrl'
        })
      .when('/questionPaper/:id', {
        templateUrl: 'partials/questionPaper',
        controller: 'QuestionpaperCtrl'
       })
        .when('/paperCompleted', {
            templateUrl: 'partials/paperSuccess'
        })
        .when('/myDashboard', {
            templateUrl: 'partials/candidateDashboard'
        })
        .when('/answerSheet/:passKey', {
            templateUrl: 'partials/candidateAnswerSheet'
        })
       .when('/skills', {
        templateUrl: 'partials/skillHierarchy',
        controller: 'SkillsCtrl'
       })
        .when('/tree', {
            templateUrl: 'partials/hierarchyTreed3js',
            controller: 'SkillsCtrl'
        })
        .when('/api/emitEvent', {
            templateUrl: 'partials/testStart',
            controller: 'QuestionpaperCtrl|function()='
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

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });