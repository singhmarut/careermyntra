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
  env: 'production',
  ip:   process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        '0.0.0.0',
  port: process.env.PORT ||
        8000,
    graderBaseUrl: 'http://162.243.214.217:8000',
    emailURL: 'http://examcue.com/account/activate/',
    mongo: {
        uri: 'mongodb://162.243.159.42/pupilsboard'
  },

    google: {
        returnURL: 'http://examcue.com/auth/google/callback',
        realm: 'http://127.0.0.1:1337'
    }
};