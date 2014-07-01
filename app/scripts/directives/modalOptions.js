'use strict';

angular.module('pupilsboardApp')
    .config(function($modalProvider) {
        angular.extend($modalProvider.defaults, {
            animation: 'am-flip-x',
            backdropAnimation: 'am-fade'
        });
});