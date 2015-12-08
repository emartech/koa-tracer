'use strict';

let router = require('koa-router')();

router.get('/', require('./routes/main'));
router.get('/id', require('./routes/id'));

module.exports = router;
