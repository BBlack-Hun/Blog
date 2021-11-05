const csrfProtection = require('../middleware/csrf');
const { Router } = require('express');
const router = Router();
const xsrf = require('./home/index');

router.use('/accounts', require('./accounts'));
// router.use('/auth', require('./auth'));
router.use('/users', require('./user'));
router.use('/posts', require('./post'));
router.use('/categories', require('./category'));

router.use('/', require('./home'));

module.exports = router;
