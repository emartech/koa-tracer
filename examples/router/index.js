'use strict';

let koa = require('koa');
let app = koa();
let tracer = require('../../index');
let router = require('./router');

app.use(tracer());
app.use(router.routes());

app.listen(3000, () => console.log('Server started on port 3000'));
