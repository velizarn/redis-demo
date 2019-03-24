/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */
'use strict';

const
  bluebird = require('bluebird'),
  bodyParser = require('body-parser'),
  express = require('express'),
  helmet = require('helmet'),
  logger = require('heroku-logger'),
  path = require('path'),
  redis = require('redis');
  
const index = require('./controllers/index');
const verify = require('./controllers/verify');

let {
  redisOptions
} = require('./helpers/redis');

require('dotenv').config();

bluebird.promisifyAll(redis.RedisClient.prototype);

const {
  PORT = 5000,
  NODE_ENV,
  CACHE_TTL = 600,
  REDIS_PASSWORD = '',
  REDIS_URL
} = process.env;

if (REDIS_PASSWORD !== '') {
  redisOptions.password = REDIS_PASSWORD;
}

const client = redis.createClient(redisOptions);

const app = express();

app
  .use(express.static('public'))
  .set('views', path.join(__dirname, '../views'))
  .set('view engine', 'ejs')
  .use(helmet())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json());
  
app.locals.client = client;
app.locals.expiresIn = CACHE_TTL;

app.use('/', index.router);
app.use('/', verify.router);

module.exports = app.listen(PORT, () => logger.info(`Listening on ${ PORT }`));

/**
 * https://stackoverflow.com/questions/9765215/global-variable-in-app-js-accessible-in-routes
 * https://stackoverflow.com/questions/33986863/mocha-api-testing-getting-typeerror-app-address-is-not-a-function
 */
 