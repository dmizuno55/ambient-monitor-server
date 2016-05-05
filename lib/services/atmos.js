'use strict'
const _ = require('lodash');
const myUtils = require('../core/utils');
const db = require('../core/db');

const storage = [];

const atmosService = module.exports;

/**
 * find air log data
 * @param {number} from timestamp
 * @param {number} to timestamp
 * @param callback
 */
atmosService.find = function(from, to, callback) {
  if (!_.isNumber(from) || !_.isNumber(to)) {
    callback(null, []);
  }

  if (from > to) {
    callback(null, []);
    return;
  }

  const query = {
    time: {
      $gte: from,
      $lte: to
    }
  };

  db.Atmos.find(query, (err, records) => {
    if (err) {
      callback(err);
      return;
    }

    callback(null, records.map(_.clone));
  });
};

/**
 * append air log data
 * @param {Object} data
 * @param callback
*/
atmosService.append = function(data, callback) {
  db.Atmos.insert(data, callback);
};
