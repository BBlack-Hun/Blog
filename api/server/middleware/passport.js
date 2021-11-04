const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const { encrpt, decrpt } = require('../helper/passwordHash');

// strategy 생성
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (username, password, done) => {
      return User.findOne({
        username: username,
      })
        .then((user) => {
          const orgPw = decrpt(user.password);
          if (password === orgPw) {
            return user;
          }
        })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'Incorrect ID or PW' });
          }
          return done(null, user, { message: 'Login Success' });
        })
        .catch((err) => done(err));
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log('serializeUser 작동');
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('serializeUser 작동');
  // user.password = '';
  done(null, user);
});

module.exports = passport;
