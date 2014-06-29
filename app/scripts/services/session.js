'use strict';

angular.module('pupilsboardApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
