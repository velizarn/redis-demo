/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */
'use strict';

const
  bodyParser = require('body-parser'),
  express = require('express'),
  helmet = require('helmet'),
  logger = require('heroku-logger'),
  path = require('path'),
  redis = require('redis'),
  bluebird = require('bluebird'),
  throng = require('throng');
  
const index = require('./controllers/index');
let {
  redisOptions
} = require('./helpers/redis');

require('dotenv').config();

const WORKERS = process.env.WEB_CONCURRENCY || require('os').cpus().length;

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

if (NODE_ENV !== 'test') {
  throng({
    workers: WORKERS,
    lifetime: Infinity,
    master: startMaster,
    start: startWorker
  });
} else {
  startWorker(1);
}

// This will only be called once
function startMaster() {
  logger.info('Started master');
}

function startWorker(workerId) {
  
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
  app.locals.workerId = workerId;
  
  app.use(index.router);
  
  module.exports = app.listen(PORT, () => logger.info(`Listening on ${ PORT } / ${workerId}`));
}
