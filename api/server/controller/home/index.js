const { Router } = require('express');
const csrfProtection = require('../../middleware/csrf');
const router = Router();

router.get('/', csrfProtection, (req, res) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    expires: new Date(Date.now() + 3 * 3600000), // 3시간 동안 유효
  });
  // 데이터 리턴
  res.json(req.csrfToken());
});

module.exports = router;
