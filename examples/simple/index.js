'use strict';

let koa = require('koa');
let app = koa();
let tracer = require('../../index');
let slowComputation = require('../slow-computation');

app.use(tracer());

app.use(function *() {
  tracer.log('test-event', { event_id: 'test' });

  tracer.startTracing('slow-computation');
  yield slowComputation();
  tracer.endTracing('slow-computation');

  this.body = 'Hello simple world!';
});

app.listen(3000, () => console.log('Server started on port 3000'));
