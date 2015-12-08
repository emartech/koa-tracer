'use strict';

let tracer = require('../../index');
let slowComputation = require('../slow-computation');

module.exports = function* () {

  tracer.startTracing('read-file');
  yield slowComputation();
  tracer.endTracing('read-file');

  this.body = 'Hello router world!';
};
