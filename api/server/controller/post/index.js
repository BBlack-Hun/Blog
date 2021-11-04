const { Router } = require('express');
const router = Router();
const ctrl = require('./post.ctrl');

const csrfProtection = require('../../middleware/csrf');
const loginRequired = require('../../middleware/loginRequired');

const upload = require('../../middleware/multer');

// GET POST
router.get('/:id', ctrl.get_post);

// GET ALL POSTS
router.get('/', ctrl.get_posts);

// CREATE POST
router.post('/', upload.single('photo'), ctrl.post_post);

// UPDATE POST
router.put('/:id', upload.single('photo'), ctrl.update_post);

// DELETE POST
router.delete('/:id', ctrl.delete_post);

module.exports = router;
