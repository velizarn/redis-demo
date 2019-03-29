/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */
'use strict';

require('dotenv').config();

const defaults = require('./defaults');

const WORKERS = process.env.WEB_CONCURRENCY || require('os').cpus().length;

const {
  CACHE_TTL = defaults.cacheTtl,
  NODE_ENV,
  LOG_LEVEL = 'error',
  PORT = defaults.appPort,
  REDIS_PASSWORD = '',
  REDIS_URL,
  SESSION_COOKIE_SECRET = defaults.sessionCookieSecret,
  SESSION_NAME = defaults.sessionCookieId
} = process.env;
  
let {
  redisOptions
} = require('./helpers/redis');

if (REDIS_PASSWORD !== '') {
  redisOptions.password = REDIS_PASSWORD;
}

const
  bodyParser = require('body-parser'),
  express = require('express'),
  helmet = require('helmet'),
  Logger = require('heroku-logger').Logger,
  path = require('path'),
  redis = require('redis'),
  redisClient = redis.createClient(redisOptions),
  session = require('express-session'),
  redisStore = require('connect-redis')(session),
  throng = require('throng');

const logger = new Logger({ level: LOG_LEVEL});
  
const index = require('./controllers/index');
const verify = require('./controllers/verify');

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
  
  const app = express();
  
  app
    .use(session({
      secret: SESSION_COOKIE_SECRET,
      name: SESSION_NAME,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Note that the cookie-parser module is no longer needed
      store: new redisStore({
        url: REDIS_URL,
        client: redisClient,
        ttl: CACHE_TTL
      }),
    }))
    .use(express.static('public'))
    .set('views', path.join(__dirname, '../views'))
    .set('view engine', 'ejs')
    .use(helmet())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json());

  app.locals.logger = logger;
  app.locals.client = redisClient;
  
  app.use('/', index.router);
  app.use('/', verify.router);
  
  module.exports = app.listen(PORT, () => logger.info(`Listening on ${ PORT } / ${workerId}`));
}

/**
 * https://stackoverflow.com/questions/9765215/global-variable-in-app-js-accessible-in-routes
 * https://stackoverflow.com/questions/33986863/mocha-api-testing-getting-typeerror-app-address-is-not-a-function
 * https://www.npmjs.com/package/express-session
 */
