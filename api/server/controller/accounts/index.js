const { Router } = require('express');
const router = Router();
const ctrl = require('./accounts.ctrl');

const passport = require('../../middleware/passport');

const csrfProtection = require('../../middleware/csrf');

const upload = require('../../middleware/multer');

// REGISTER
router.post(
  '/register',
  csrfProtection,
  upload.single('profilePic'),
  ctrl.post_register,
);

// LOGIN
router.post(
  '/login',
  passport.authenticate('local'),
  csrfProtection,
  ctrl.post_login,
);

// LOGOUT
router.get('/logout', ctrl.get_logout);

module.exports = router;
