const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passwordHash = require('../helpers/passwordHash');
const models = require('../models');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      const user = await models.User.findOne({
        where: {
          username,
          password: passwordHash(password),
        },
        // attributes: { exclude: ['passport'] },
      });
      if (!user) {
        return done(null, false, {
          message: '일치하는 아이디 패스워드가 없습니다.',
        });
      } else {
        return done(null, user.dataValues);
      }
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
