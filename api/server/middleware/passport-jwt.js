require('dotenv').config();
const passport = require('passport');
const User = require('../models/User');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const { encrpt, decrpt } = require('../helper/passwordHash');

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SEC,
};

const JWTVerify = async (jwtPayload, done) => {
  try {
    // jwtPayload에 유저 정보가 담겨 있다.
    const user = await User.findOne({
      username: jwtPayload.username,
    });
    const orgPw = decrpt(user.password);
    if (jwtPayload.password !== orgPw) {
      done(null, false, { message: 'inaccurate token' });
    }
    // 유효한 유저라면
    done(null, user);
    return;
  } catch (err) {
    console.error(err);
    done(err);
  }
};

passport.use('jwt', new JWTStrategy(JWTConfig, JWTVerify));

const passportConfig = { usernameField: 'username' };

passport.use(
  'login',
  new LocalStrategy(passportConfig, async (username, password, done) => {
    const user = await User.findOne({ username: username });

    const orgPw = decrpt(user.password);
    if (password !== orgPw) {
      return done(null, false, { message: 'Incorrect ID or PW' });
    }
    return done(null, username, { message: 'Sign in Successful' });
  }),
);

module.exports = passport;
