'use strict';

require('dotenv').config();

const {
  SECURE_KEY_STR
} = process.env;

/**
 * Default values for .env variables and global app vars
 */
module.exports = {
  
  sessionCookieId: 'sid',
  
  sessionCookieTtl: 30, // min
  
  sessionCookieSecret: SECURE_KEY_STR,
  
  cacheTtl: 86400, // sec
  
  appPort: 5000
};
