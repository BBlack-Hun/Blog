const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookiParser = require('cookie-parser');
const dotenv = require('dotenv');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// admin 생성
const User = require('./server/models/User');
const { encrpt } = require('./server/helper/passwordHash');

// flash
const passport = require('passport');
const flash = require('connect-flash');

class App {
  constructor() {
    this.app = express();

    dotenv.config();

    // db 접속
    this.dbConnection();

    // 세션 세팅
    this.setSession();

    // 미들웨어 세팅
    this.setMiddleWare();

    // routing
    this.getRouting();

    // 정적 위치
    this.setStatic();
  }

  dbConnection() {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log(
          'Connection has been established successfully. host: ' +
            mongoose.connection.host,
        );
      })
      .then(async () => {
        const admin = await User.findOne({ username: 'admin' });
        if (!admin) {
          const password = encrpt(process.env.PASS_ADMIN);
          const newAdmin = new User({
            username: process.env.USERNAME,
            email: process.env.EMAIL,
            password: password,
            isAdmin: process.env.ADMIN,
          });
          const user = await User.register(newAdmin, password);
          console.log(`Admin is created successfully!`);
        }
      })
      .catch((err) => {
        console.error('Unable to connect to the database', err);
        process.exit(1);
      });
  }

  setMiddleWare() {
    // 미들웨어 세팅
    this.app.use(express.json());
    this.app.use(logger('tiny'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookiParser());
  }

  setSession() {
    // 세션 세팅
    // this.app.sessionMiddleWare = session({
    //   secret: 'bblack_hun',
    //   resave: false,
    //   saveUninitialized: true,
    //   cookie: {
    //     maxAge: 2000 * 60 * 60,
    //   },
    //   store: new MongoStore({
    //     mongooseConnection: mongoose.connection,
    //     collection: 'sessions',
    //   }),
    // });
    // this.app.use(this.app.sessionMiddleWare);

    // passport 적용
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // flash 메시지 관련
    // this.app.use(flash);

    console.log(`Session setting!`);
  }
  setStatic() {
    this.app.use('/server/uploads', express.static('uploads'));
  }

  getRouting() {
    this.app.use('/api', require('./server/controller'));
  }
}

module.exports = new App().app;
