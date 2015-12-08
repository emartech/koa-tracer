'use strict';

let tracer = require('../../../index');
let logger = require('logentries-logformat')('tracer');


module.exports = function* () {
  logger.log('request-id', {
    request_id: tracer.getRequestId()
  });

  this.body = 'It should write the request id to the console';
};
