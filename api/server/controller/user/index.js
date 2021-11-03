const { Router } = require('express');
const router = Router();
const ctrl = require('./user.ctrl');

const csrfProtection = require('../../middleware/csrf');

const upload = require('../../middleware/multer');

// UPDATE
router.put('/:id', ctrl.update_user);

// DELETE
router.delete('/:id', ctrl.delete_user);

// GET USER
router.get('/:id', ctrl.get_user);

module.exports = router;
