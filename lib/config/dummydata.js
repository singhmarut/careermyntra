'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User');


// Clear old users, then add a default user
User.find({'email': 'test@test.com' },function(err,data) {
    if (!data || data.length == 0){
        User.create({
                provider: 'local',
                name: 'Test User',
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
