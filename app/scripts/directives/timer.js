/*
 * Copyright (c) 2015. All rights reserved.
 *
 *   This file is created and owned by careermyntra. software licensed to you under enterprise Software License Agreement (the "License")
 *   You may not use this file except in compliance with the License. For licensing contact: support@careermyntra.com
 *
 *   Unauthorized reverse engineering, disassembly or modifications prohibited.
 *   CareerMyntra Confidential
 */

/**
 * Created by Marut on 25/06/14.
 */

angular.module('pupilsboardApp', [])
    // Register the 'myCurrentTime' directive factory method.
    // We inject $interval and dateFilter service since the factory method is DI.
    .directive('remainingTime', function($interval, dateFilter) {
        // return the directive link function. (compile function not needed)
        return function(scope, element, attrs) {
            var format,  // date format
                stopTime; // so that we can cancel the time updates

            // used to update the UI
            function updateTime() {
                //element.text(dateFilter(new Date(), format));
                sectionTime = value-1;
                element.text("Hello");
            }

            // watch the expression, and update the UI on change.
            scope.$watch(attrs.remainingTime, function(value) {
                sectionTime = value;
                updateTime();
            });

            stopTime = $interval(updateTime, 1000);

            // listen on DOM destroy (removal) event, and cancel the next UI update
            // to prevent updating time ofter the DOM element was removed.
            element.on('$destroy', function() {
                $interval.cancel(stopTime);
            });
        }
    });
