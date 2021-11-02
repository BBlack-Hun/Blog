const { Router } = require('express');
const router = Router();
const ctrl = require('./accounts.ctrl');

const csrfProtection = require('../../middleware/csrf');

const upload = require('../../middleware/multer');

// UPDATE
router.post('/register', ctrl.post_register);

// LOGIN
router.post('/login', ctrl.post_login);

module.exports = router;
