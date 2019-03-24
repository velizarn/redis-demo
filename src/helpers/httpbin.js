'use strict';

/**
 * Return UUID4
 */
const getUUIDHeaders = (url='https://httpbin.org/uuid') => {
  return {
    method: 'GET',
    url,
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  };
};

module.exports = {
  getUUIDHeaders
};