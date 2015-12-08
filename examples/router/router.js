'use strict';

let router = require('koa-router')();

router.get('/', require('./routes/main'));
router.get('/id', require('./routes/id'));
router.get('/log', require('./routes/log'));

module.exports = router;
