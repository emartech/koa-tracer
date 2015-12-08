'use strict';

let tracerSession = require('continuation-local-storage').createNamespace('koa-tracer');
let Tracer = require('./tracer');

let tracer = new Tracer(tracerSession);

module.exports = function GetTracerMiddleware() {
  return function*(next) {
    let context = tracerSession.createContext();
    tracerSession.enter(context);

    tracer.checkNamespaceOverrun();
    tracer.setRequestId(this);
    tracer.startTracing('request');

    yield next;

    tracer.endTracing('request');
    tracerSession.exit(context);
  };
};


module.exports.tracer = tracer;
module.exports.startTracing = tracer.startTracing.bind(tracer);
module.exports.endTracing = tracer.endTracing.bind(tracer);
module.exports.getRequestId = tracer.getRequestId.bind(tracer);
