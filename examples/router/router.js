'use strict';

let router = require('koa-router')();

router.get('/', require('./main-route'));
router.get('/id', require('./id-route'));

module.exports = router;
