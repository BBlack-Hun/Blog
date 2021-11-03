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
          console.log('111111', user);
          if (!user) {
            return done(null, false, { message: 'Incorrect ID or PW' });
          }
          console.log('222222222');
          return done(null, user, { message: 'Login Success' });
        })
        .catch((err) => done(err));
    },
  ),
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
