'use strict';

module.exports = {
  env: 'production',
  ip:   process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        '0.0.0.0',
//  port: process.env.OPENSHIFT_NODEJS_PORT ||
//        process.env.PORT ||
//        8000,
    graderBaseUrl: 'http://localhost:8080/',
  mongo: {
    uri: process.env.MONGOLAB_URI ||
         process.env.MONGOHQ_URL ||
         process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
         'mongodb://162.243.159.42/pupilsboard'
  },

    google: {
        returnURL: 'http://careermyntra.com/auth/google/callback',
        realm: 'http://127.0.0.1:1337'
    }
};