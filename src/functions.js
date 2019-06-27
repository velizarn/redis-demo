/* eslint no-unused-vars: 0 */
'use strict';

/**
 * Check if an object is empty
 */
const isEmptyObject = (obj) => {
  for (var key in obj) {
    if(Object.prototype.hasOwnProperty.call(obj, key))
      return false;
  }
  return true;
};

module.exports = {
  isEmptyObject
};
