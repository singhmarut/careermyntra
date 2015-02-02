/*
 * Copyright (c) 2015. All rights reserved.
 *
 *   This file is created and owned by careermyntra. software licensed to you under enterprise Software License Agreement (the "License")
 *   You may not use this file except in compliance with the License. For licensing contact: support@careermyntra.com
 *
 *   Unauthorized reverse engineering, disassembly or modifications prohibited.
 *   CareerMyntra Confidential
 */

angular.module('htmlFilters', []).filter('limitFilter', function() {
    return function(input, limitTo) {
        return input.slice(0,limitTo);
    };
}).directive('myHtml',
        ['$sce', function($sce) {

            return function(scope, element, attr) {
                var value = $sce.getTrustedHtml(attr.myHtml);
                console.log(value);
                value = value.replace(/(<([^>]+)>)/ig,"");
                if (value){
                    value = value.slice(0,30);
                }
                element.html(value || '');
//                scope.$watch('attr.myHtml', function(value) {
//                    if (value){
//                        console.log($sce.parseAsHtml(attr.ngBindHtml));
//                        element.html(value || '');
//                    }
//                });
            };
        }]
    );