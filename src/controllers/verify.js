/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */
'use strict';

const
  express = require('express'),
  logger = require('heroku-logger');

require('dotenv').config();
  
const {
  VERIFICATION_URI = '',
  VERIFICATION_CONTENT = ''
} = process.env;

const router = new express.Router();

if (VERIFICATION_URI !== '') {
  router.get(VERIFICATION_URI, (req, res) => {
    res.send(VERIFICATION_CONTENT);
  });
}

router.get('/verify', (req, res) => {
  res.send('Please update config_vars.');
});
  
module.exports = {
  router
};
