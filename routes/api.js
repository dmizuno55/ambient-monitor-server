'use strict'
const express = require('express');
const router = express.Router();

const myUtils = require('../lib/core/utils');
const atmosService = require('../lib/services/atmos');

/**
 * get atmos data log
 */
router.get('/atmos', (req, res, next) => {
  const query = req.query || {};

  let from = query.from && parseInt(query.from);
  let to = query.to && parseInt(query.to);
  if (!query.from || !query.to) {
    const today = new Date();
    from = myUtils.getStartOfDate(today).getTime();
    to = myUtils.getEndOfDate(today).getTime();
  }

  atmosService.find(from, to, (err, list) => {
    if (err) {
      res.status(500).json({status: 'Error'});
      return;
    }

    res.status(200).json({
      status: 'OK',
      result: list.map(record => {
        return {
          time: record.time,
          temperature: record.content.temperature,
          humdity: record.content.humdity
        };
      })
    });
  });
});

/**
 * add atmos data log
 */
router.post('/atmos', (req, res, next) => {
  const data = req.body;

  atmosService.append(data, (err) => {
    if (err) {
      res.status(500).json({status: 'Error'});
      return;
    }

    res.status(200).json({status: 'OK'});
  });
});

module.exports = router;
