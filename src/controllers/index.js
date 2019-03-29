/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */
'use strict';

const
  express = require('express'),
  request = require('request-promise');

const {
  getUUIDHeaders
} = require('../helpers/httpbin');
  
const router = new express.Router();

router.get('/', (req, res) => {
  const _myDate = (new Date()).toLocaleString();
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  req.session.myDate = _myDate;
  res.send({ data: _myDate, session: req.session });
});

router.get('/sess/get', (req, res) => {
  
  const logger = req.app.locals.logger;
  
  let workerStr = '';
  
  if ('workerId' in req.app.locals) {
    const workerId = parseInt(req.app.locals.workerId);
    workerStr = `/ ${workerId}`;
  }
  
  let uuid = req.session.uuid || '__empty__';
  let getUuidPromise = null;
  
  if (uuid === '__empty__') {
    getUuidPromise = request(getUUIDHeaders());
  }
  
  Promise.all([uuid, getUuidPromise])
    .then((result) => {
      let [uuid, remotedata] = result;
      if (uuid === '__empty__') {
        if ('uuid' in remotedata) {
          uuid = remotedata.uuid;
          logger.info(`Calculate UUID value: ${uuid}${workerStr}`);
          req.session.uuid = uuid;
          return uuid;
        }
        else throw new Error('Unable to compute UUID value.');
      }
      else {
        logger.info(`Retrieve UUID value from session: ${uuid}${workerStr}`);
        return uuid;
      }
    })
    .then((uuid) => {
      res.send({ result: uuid, session: req.session });
    })
    .catch((err) => {
      logger.error(err + '');
      res.status(500);
      res.setHeader('Content-Type', 'application/json');
      res.send({result: 'failed'});
    });
});

module.exports = {
  router
};
