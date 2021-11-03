module.exports = function (req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(500).json('You need login');
  } else {
    return next();
  }
};
