#Koa tracer middleware

This is a small Koa middleware to easily create tracing logs and performance profiles of your code. The tracing mechanism is based on async-listener API so that you can require the tracer library anywhere in your code, it will be "magically" attached to the actual Koa request and log the request id for all it's log entries.

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

**To see the tracer log-entries you have to set the `DEBUG=tracer` environment variable!** 

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

## Request id fetching
The library search for the `x-request-id` and the `request-id` headers to get the request ids. Because of this, it's compatible with most of the existing PaaS providers.

## Tracer functions

### Log
Simply log an event and a flat json data. The actual request id will be attached to the logs.

```javascript
tracer.log('test-event', { event_id: 'test' });
```

Logs in the console:

```
tracer type="tracer" event="test-event" event_id="test" request_id="124"
```

### startTracing, endTracing
You have to provide a tracing id as strings for these functions. The start and the end of the tracing will be logged with the duration in msec. The actual request id will be attached to the logs.
 
```javascript
tracer.startTracing('slow-computation');
yield someSlowComputation();
tracer.endTracing('slow-computation');
```

Logs in the console:

```
tracer type="tracer" event="slow-computation" status="start" request_id="124"
tracer type="tracer" event="slow-computation" status="end" duration="54ms" request_id="124"
```

### getRequestId
Get the request id anywhere in your code. 

```javascript
console.log('The requestId is', tracer.getRequestId());
```
