const { Router } = require('express');
const router = Router();
const ctrl = require('./accounts.ctrl');

const csrfProtection = require('../../middleware/csrf');

const upload = require('../../middleware/multer');

//REGISTER
router.post('/register', ctrl.post_register);

// CREATE

module.exports = router;
