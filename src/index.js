'use strict';

let tracerSession = require('continuation-local-storage').createNamespace('koaTracer');
let Tracer = require('./tracer');

let tracer = new Tracer(tracerSession);

module.exports = function GetTracerMiddleware() {
  return function*(next) {
    let context = tracerSession.createContext();
    tracerSession.enter(context);

    tracer.setRequestId(this);
    tracer.startTracing('request');

    yield next;

    tracer.endTracing('request');
    tracerSession.exit(context);
  };
};


module.exports.tracer = tracer;
module.exports.log = tracer.log.bind(tracer);
module.exports.startTracing = tracer.startTracing.bind(tracer);
module.exports.endTracing = tracer.endTracing.bind(tracer);
module.exports.getRequestId = tracer.getRequestId.bind(tracer);
