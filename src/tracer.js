'use strict';

let _ = require('lodash');
let microtime = require('microtime');
let logger = require('logentries-logformat')('tracer');


class Tracer {

  constructor(tracerSession) {
    this._session = tracerSession;
  }


  startTracing(event) {
    this.log(event, { status: 'start' });
    this._session.set('startTime-' + event, microtime.now());
  }


  endTracing(event, data) {
    this.log(event, _.extend(data || {}, {
      status: 'end',
      duration: this._getDuration('startTime-' + event) + 'ms'
    }));
  }


  getRequestId() {
    return this._session.get('requestId');
  }


  log(event, data) {
    logger.log(event, _.extend(data || {}, {
      request_id: this.getRequestId()
    }));
  }


  setRequestId(koaContext) {
    let headers = _.get(koaContext, 'request.header', {});
    this._session.set('requestId', headers['request-id'] || headers['x-request-id'] || '');
  }


  _getDuration(timeType) {
    return Math.round((microtime.now() - this._session.get(timeType)) / 1000);
  }


}

module.exports = Tracer;
