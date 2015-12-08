'use strict';

let koa = require('koa');
let app = koa();
let tracer = require('../../index');
let slowComputation = require('../slow-computation');

app.use(tracer());

app.use(function *() {

  tracer.startTracing('read-file');
  yield slowComputation();
  tracer.endTracing('read-file');

  this.body = 'Hello simple world!';
});

app.listen(3000, () => console.log('Server started on port 3000'));
