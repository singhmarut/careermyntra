'use strict';

module.exports = {
  env: 'development',
  port: process.env.PORT ||
        8000,
  graderBaseUrl: 'http://localhost:8080/',
  mongo: {
    uri: 'mongodb://localhost/pupilsboard'
  },
    google: {
        returnURL: 'http://127.0.0.1:1337/auth/google/callback',
        realm: 'http://127.0.0.1:1337'
    }
};