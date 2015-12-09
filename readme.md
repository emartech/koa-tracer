#Koa tracer middleware

This is a small Koa middleware to easily create tracing logs and performance profiles of your code. The tracing mechanism is based on async-listener API so that you can require the tracer library anywhere in your code, it will be "magically" attached to the actual Koa request.

```bash
npm install --save koa-tracer
```

## Setup middleware
 
```javascript
let app = require('koa')();
let tracer = require('koa-tracer');

app.use(tracer());

app.listen(3000);
```

## Usage
After adding the tracer middleware, you can require and use the tracer library functions anywhere in your code if it's in the call stack of a request.

*To see the tracer log-entries you have to set the `DEBUG=tracer` environment variable!* 

```javascript
let tracer = require('koa-tracer');

app.use(function *() {
  tracer.log('test-event', { event_id: 'test' });

  tracer.startTracing('slow-computation');
  yield someSlowComputation();
  tracer.endTracing('slow-computation');
  
  this.body = `Get requestId anywhere using ${tracer.getRequestId()}`;
});
```

## Tracer functions

### Log
Simply log an event and a flat json data.

```javascript
tracer.log('test-event', { event_id: 'test' });
```

### startTracing, endTracing
You have to provide a tracing id as strings for these functions. The start and the end of the tracing will be logged with the duration in msec.
 
```javascript
tracer.startTracing('slow-computation');
yield someSlowComputation();
tracer.endTracing('slow-computation');
```

### getRequestId
Get the request id anywhere in your code. 

```javascript
console.log('The requestId is', tracer.getRequestId());
```
