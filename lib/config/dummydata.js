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

var mongoose = require('mongoose'),
  User = mongoose.model('User');


// Clear old users, then add a default user
User.find({'email': 'test@test.com' },function(err,data) {
    if (!data || data.length == 0){
        User.create({
                provider: 'local',
                name: 'Test User',
                userName: 'test@test.com',
                email: 'test@test.com',
                password: 'test',
                active: true,
                role: 'admin'
            }, function() {
                console.log('finished populating users');
            }
        );
    }
});
