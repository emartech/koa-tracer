'use strict';

let tracer = require('../../../index');

module.exports = function* () {
  tracer.log('sample-event', { event_title: 'sample' });

  this.body = 'It should log to the console with tracer';
};
