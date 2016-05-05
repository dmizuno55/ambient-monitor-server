'use strict'

const utils = module.exports;

/**
 * get DayKey(yyyyMMDD)
 * @param {Date} date
 * @return {number}
 */
utils.getDayKey = function(date) {
  if (!date) {
    return 0;
  }

  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();

  return y * 10000 + m * 100 + d;
};

/**
 * calculate delta of days between date
 * @param {Date} date1
 * @param {Date} date2
 * @return {number}
 */
utils.calcDeltaDays = function(date1, date2) {
  if (!date1 || !date2) {
    return 0;
  }

  const deltaTime = date1.getTime() - date2.getTime();

  return Math.floor(Math.abs(deltaTime / 1000 / 24 / 60 / 60));
};

/**
 * convert date from DayKey
 * @param {number} dayKey
 * @return {Date}
 */
utils.getDateFromDayKey = function(dayKey) {
  const y = Math.floor(dayKey / 10000);
  const m = Math.floor((dayKey - (y * 10000)) / 100) - 1;
  const d = dayKey - (y * 10000) - (m * 100);

  const date = new Date();
  date.setFullYear(y);
  date.setMonth(m);
  date.setDate(d);

  return date;
};

/**
 * adjust date with properties value
 * @param {Object.<number>} props
 * @param {Date} opt_base 
 * @return {Date}
 */
utils.adjustDate = function(props, opt_base) {
  const date = new Date(opt_base.getTime()) || new Date();
  const propMethods = {
    year: 'setFullYear',
    month: 'setMonth',
    date: 'setDate',
    hours: 'setHours',
    minutes: 'setMinutes',
    seconds: 'setSeconds',
    milliseconds: 'setMilliseconds'
  };

  Object.keys(props).forEach((key) => {
    const value = key === 'month' ? props[key] + 1 : props[key];
    date[propMethods[key]](value);
  });

  return date;
};

/**
 * get start of date
 * @param {Date} date
 * @return {Date}
 */
utils.getStartOfDate = function(date) {
  return utils.adjustDate({
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0
  }, date);
};

/**
 * get end of date
 * @param {Date} date
 * @return {Date}
 */
utils.getEndOfDate = function(date) {
  return utils.adjustDate({
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 59
  }, date);
};
