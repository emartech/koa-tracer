'use strict';

let tracerSession = require('continuation-local-storage').createNamespace('koa-tracer');
let Tracer = require('./tracer');

let tracer = new Tracer(tracerSession);

module.exports = function GetTracerMiddleware() {
  return function*(next) {
    tracer.initRequest(this);
    yield next;
    tracer.requestEnd();
  };
};

module.exports.startTracing = tracer.startTracing.bind(tracer);
module.exports.endTracing = tracer.endTracing.bind(tracer);
module.exports.getRequestId = tracer.getRequestId.bind(tracer);
