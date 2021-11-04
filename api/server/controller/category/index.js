const { Router } = require('express');
const router = Router();
const ctrl = require('./category.ctrl');

// CREATE CATEGORY
router.post('/', ctrl.post_category);

// GET CATEGORIES
router.get('/', ctrl.get_category);

module.exports = router;
