'use strict';

const
  express = require('express'),
  path = require('path'),
  redis = require('redis'),
  bluebird = require('bluebird');

redis.debug_mode = false;

require('dotenv').config();

bluebird.promisifyAll(redis.RedisClient.prototype);

const PORT = process.env.PORT || 5000;
const CACHE_TTL = process.env.CACHE_TTL || 600;

let redisOptions = {
  url: process.env.REDIS_URL,
  no_ready_check: true,
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
        return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
        return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
};

if (process.env.REDIS_PASSWORD) {
  redisOptions.password = process.env.REDIS_PASSWORD;
}

const client = redis.createClient(redisOptions);

const app = express();

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.use((req, res, next) => {
  client.getAsync('date')
    .then((data) => {
      if (data === null || data === '') {

        const myDate = (new Date()).toLocaleString();
        client.set('date', myDate, 'EX', CACHE_TTL);
        app.locals.dateStr = myDate;
      }
      else {
        app.locals.dateStr = data;
      }
      next()
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/', (req, res) => res.render('index', { data: app.locals.dateStr }));

app.get('/set', (req, res) => {
  const _myDate = (new Date()).toLocaleString();
  client.set('date', _myDate, 'EX', CACHE_TTL);
  res.render('index', { data: _myDate })
});

app.get('/get', (req, res) => {
  res.render('index', { data: app.locals.dateStr })
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
