const { Router } = require('express');
const router = Router();
const ctrl = require('./post.ctrl');

const csrfProtection = require('../../middleware/csrf');
const loginRequired = require('../../middleware/loginRequired');

const upload = require('../../middleware/multer');
const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require('../../middleware/verifyToken');

// GET POST
router.get('/:id', ctrl.get_post);

// GET ALL POSTS
router.get('/', ctrl.get_posts);

// CREATE POST
router.post('/', verifyToken, upload.single('photo'), ctrl.post_post);

// UPDATE POST
router.put(
  '/:id',
  verifyTokenAndAuthorization,
  upload.single('photo'),
  ctrl.update_post,
);

// DELETE POST
router.delete('/:id', verifyTokenAndAuthorization, ctrl.delete_post);

module.exports = router;
