/* eslint no-undef: 0 */
'use strict';

const logger = require('heroku-logger');

const envParams = [
  'NODE_ENV',
  'DYNO',
  'PORT',
  'HEROKU_TEST_RUN_NUMBER',
  'CI',
  'CI_NODE_INDEX',
  'HEROKU_TEST_RUN_BRANCH',
  'WEB_CONCURRENCY',
  'WEB_MEMORY',
  'MEMORY_AVAILABLE'
];

logger.info(`npm_config_user_agent: ${process.env.npm_config_user_agent}`);

envParams.forEach((item) => {
  logger.info(`${item}: ${process.env[item.toString()] || 'n/a'} `);
});

require('./spec/general');
require('./spec/errors');
