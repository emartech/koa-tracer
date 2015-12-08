'use strict';

let _ = require('lodash');
let microtime = require('microtime');
let logger = require('logentries-logformat')('tracer');

const TRACE_SESSION_ALERT_THRESHOLD = parseFloat(process.env.TRACE_SESSION_ALERT_THRESHOLD) || 2000;

class Tracer {

  constructor(tracerSession) {
    this._session = tracerSession;
    this._context = tracerSession.createContext();
  }


  initRequest(koaContext) {
    this._session.enter(this._context);
    this._setRequestId(koaContext);
    this.startTracing('request');
    this._checkNamespaceOverrun();
  }


  requestEnd() {
    this.endTracing('request');
    this._session.exit(this._context);
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


  _setRequestId(koaContext) {
    let headers = _.get(koaContext, 'request.header', {});
    this._session.set('requestId', headers['request-id'] || headers['x-request-id'] || '');
  }


  _getDuration(timeType) {
    return Math.round((microtime.now() - this._session.get(timeType)) / 1000);
  }


  _checkNamespaceOverrun() {
    let namespaceCount = _.get(process, 'namespaces.redirector._set', []).length;
    if (namespaceCount > TRACE_SESSION_ALERT_THRESHOLD) {
      logger.error('namespace-overrun', 'Too much active trace namespaces, possible memory leak', { amount: namespaceCount });
    }
  }

}

module.exports = Tracer;
