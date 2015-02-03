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

module.exports = {
  env: 'development',
  port: process.env.PORT ||
        8000,
  graderBaseUrl: 'http://localhost:8085',
  redis : {
      host: '127.0.0.1',
      port:6379
  },
  emailURL: 'http://examcue.com/account/activate/',
  mongo: {
    uri: 'mongodb://localhost/pupilsboard'
  },
    google: {
        returnURL: 'http://127.0.0.1:1337/auth/google/callback',
        realm: 'http://127.0.0.1:1337'
    }
};