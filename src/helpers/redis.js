'use strict';

const redisOptions = {
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

module.exports = {
  redisOptions
};