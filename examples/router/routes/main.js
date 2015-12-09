'use strict';

let tracer = require('../../../index');
let slowComputation = require('../../slow-computation');

module.exports = function* () {

  tracer.startTracing('slow-computation');
  yield slowComputation();
  tracer.endTracing('slow-computation');

  this.body = 'Hello router world!';
};
