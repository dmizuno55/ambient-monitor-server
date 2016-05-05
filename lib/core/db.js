'use strict'
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const collections = [
  'Atmos'
];

class DB {
  init(config, callback) {
    MongoClient.connect(getDataSource_(config), (err, db) => {
      if (err) {
        callback(err);
        return;
      }

      this.db_ = db;

      setup_(this);

      callback();
    });
  }
}

function getDataSource_(config) {
  return `mongodb://${config.host}:${config.port}/${config.dbname}`
}

function setup_(db) {
  collections.forEach((c) => {
    db[c] = {};
    db[c].find = find_.bind(db, c);
    db[c].findOne = findOne_.bind(db, c);
    db[c].insert = insert_.bind(db, c);
    db[c].update = update_.bind(db, c);
    db[c].remove = remove_.bind(db, c);
  });
}

function find_(col, query, callback) {
  const collection =  this.db_.collection(col);

  collection.find(query).toArray(callback);
}

function findOne_(col, query, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  const collection =  this.db_.collection(col);

  collection.findOne(query, options, callback);
}

function insert_(col, doc, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  const collection =  this.db_.collection(col);

  collection.insertOne(doc, options, callback);
}

function update_(col, selector, doc, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  const collection =  this.db_.collection(col);

  collection.updateOne(selector, doc, options, callback);
}

function remove_(col, selector, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  const collection =  this.db_.collection(col);

  collection.remove(selector, options, callback);
}

module.exports = new DB();
