'use strict';

let microtime = require('microtime');
let logger = require('logentries-logformat')('trace');
let _ = require('lodash');

class Tracer {

  constructor(koaContext) {
    this._requestId = this._getRequestIdFromKoa(koaContext);
    this._traces = {};
  }

  startTracing(event) {
    this._log(event, { status: 'start' });
    this._traces[event] = { startTime: microtime.now() };
  }

  endTracing(event, data) {
    this._log(event, _.extend(data || {}, {
      status: 'end',
      duration: this._getDuration(event) + 'ms'
    }));
  }

  getRequestId() {
    return this._requestId;
  }

  _log(event, data) {
    logger.log(event, _.extend(data || {}, {
      request_id: this.getRequestId()
    }));
  }

  _getRequestIdFromKoa(koaContext) {
    let headers = _.get(koaContext, 'request.header', {});
    return headers['request-id'] || headers['x-request-id'] || '';
  }

  _getDuration(event) {
    return Math.round((microtime.now() - this._traces[event].startTime) / 1000);
  }

}


module.exports = function GetTracerMiddleware() {
  return function*(next) {
    let tracer = this.tracer = new Tracer(this);
    tracer.startTracing('request');
    yield next;
    tracer.endTracing('request');
  };
};

module.exports.startTracing = function() {};
module.exports.endTracing = function() {};
