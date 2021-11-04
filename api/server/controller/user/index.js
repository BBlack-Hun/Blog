const { Router } = require('express');
const router = Router();
const ctrl = require('./user.ctrl');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('../../middleware/verifyToken');

const csrfProtection = require('../../middleware/csrf');

const upload = require('../../middleware/multer');

// UPDATE
router.put(
  '/:id',
  verifyTokenAndAuthorization,
  upload.single('profilePic'),
  ctrl.update_user,
);

// DELETE
router.delete('/:id', verifyTokenAndAuthorization, ctrl.delete_user);

// GET USER
router.get('/:id', verifyTokenAndAdmin, ctrl.get_user);

// GET ALL USERS
router.get('/', verifyTokenAndAdmin, ctrl.get_users);

module.exports = router;
