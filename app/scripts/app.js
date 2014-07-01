'use strict';

angular.module('pupilsboardApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngCkeditor',
  'ngGrid',
  'mgcrea.ngStrap',
   'ngAnimate'
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
            controller: 'AccountCtrl',
            authenticate: true
        })
        .when('/createPaper', {
            templateUrl: 'partials/questionPaper/createPaper',
            controller: 'QuestionpaperCtrl',
            authenticate: true
        })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/takeTest', {
        templateUrl: 'partials/testStart',
        controller: 'QuestionpaperCtrl',
        authenticate: true
      })
        .when('/createDummyPaper', {
            templateUrl: 'partials/dummyPaper',
            controller: 'NavbarCtrl',
            authenticate: true
        })
        .when('/questions/view', {
            templateUrl: 'partials/searchQuestions',
            controller: 'QuestionCtrl',
            authenticate: true
        })
        .when('/questions/view/:tag', {
            templateUrl: 'partials/searchQuestions',
            controller: 'QuestionCtrl',
            authenticate: true
        })
      .when('/questionPaper/:id', {
            templateUrl: 'partials/questionPaper',
            controller: 'QuestionpaperCtrl',
            authenticate: true
       })
        .when('/paperCompleted', {
            templateUrl: 'partials/paperSuccess',
            authenticate: true
        })
        .when('/myDashboard', {
            templateUrl: 'partials/candidateDashboard',
            authenticate: true
        })
        .when('/answerSheet/:passKey', {
            templateUrl: 'partials/candidateAnswerSheet',
            authenticate: true
        })
       .when('/skills', {
            templateUrl: 'partials/skillHierarchy',
            controller: 'SkillsCtrl',
            authenticate: true
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

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });