/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */
'use strict';

const
  express = require('express'),
  logger = require('heroku-logger'),
  redis = require('redis'),
  request = require('request-promise');
  
const {
  getUUIDHeaders
} = require('../helpers/httpbin');

const router = new express.Router();

router.get('/', (req, res) => {
  const _myDate = (new Date()).toLocaleString();
  res.render('index', { data: _myDate });
});

router.get('/get:ext(.json|.html)?', (req, res) => {
  
  const ext = req.params.ext || '.json';
  
  const redisClient = req.app.locals.client;
  const expiresIn = req.app.locals.expiresIn;
   
  const optionsUuid = getUUIDHeaders();
  
  let workerStr = '';
  if ('workerId' in req.app.locals) {
    const workerId = parseInt(req.app.locals.workerId);
    workerStr = `/ ${workerId}`;
  }
  
  redisClient.getAsync('uuidtest')
    .then((uuid) => {
      if (uuid) {
        return [uuid];
      }
      else {
        return Promise.all(['__expired__', request(optionsUuid)]);
      }
    })
    .then((result) => {
      let [uuid, remotedata] = result;
      if (uuid === '__expired__') {
        if ('uuid' in remotedata) {
          uuid = remotedata.uuid;
          redisClient.set('uuidtest', uuid, 'EX', expiresIn);
          logger.info(`Retrieve UUID value: ${uuid}${workerStr}`);
        }
        else throw new Error('Unable to retrieve UUID from remote server.');
      }
      else {
        logger.info(`Retrieve UUID value from cache: ${uuid}${workerStr}`);
      }
      if (ext === '.json') {
        res.setHeader('Content-Type', 'application/json');
        res.send({result: 'success'});
      }
      else {
        res.setHeader('Content-Type', 'text/html');
        res.send('Result: success');
      }
    })
    .catch((err) => {
      logger.error(err + '');
      res.status(500);
      if (ext === '.json') {
        res.setHeader('Content-Type', 'application/json');
        res.send({result: 'failed'});
      }
      else {
        res.setHeader('Content-Type', 'text/html');
        res.send('Result: failed');
      }
    });
});

module.exports = {
  router
};
