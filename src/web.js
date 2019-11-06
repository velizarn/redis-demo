/* eslint no-unused-vars: 0 */
/* eslint no-undef: 0 */
'use strict';

require('dotenv').config();

const defaults = require('./defaults');

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
  compression = require('compression'),
  express = require('express'),
  helmet = require('helmet'),
  Logger = require('heroku-logger').Logger,
  path = require('path'),
  redis = require('redis'),
  redisClient = redis.createClient(redisOptions),
  session = require('express-session'),
  redisStore = require('connect-redis')(session);

const logger = new Logger({ level: LOG_LEVEL});

const index = require('./controllers/index');
const verify = require('./controllers/verify');
  
const app = express();

redisClient.on('error', (err) => {
  logger.error('Redis error: ', err);
});

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }
  // fallback to standard filter function
  return compression.filter(req, res);
};

app
  .use(session({
    secret: SESSION_COOKIE_SECRET,
    name: SESSION_NAME,
    resave: true,
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
  .use(compression({ filter: shouldCompress, level: 6 }))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json());

app.locals.logger = logger;
app.locals.client = redisClient;

app.use('/', index.router);
app.use('/', verify.router);

module.exports = app.listen(PORT, () => logger.info(`Listening on ${ PORT }`));

/**
 * https://stackoverflow.com/questions/9765215/global-variable-in-app-js-accessible-in-routes
 * https://stackoverflow.com/questions/33986863/mocha-api-testing-getting-typeerror-app-address-is-not-a-function
 * https://www.npmjs.com/package/express-session
 */
