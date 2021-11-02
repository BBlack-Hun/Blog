const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookiParser = require('cookie-parser');
const dotenv = require('dotenv');

const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

// flash
const flash = require('connect-flash');

class App {
  constructor() {
    this.app = express();

    // 미들웨어 세팅
    this.setMiddleWare();

    // 세션 세팅
    // this.setSession();

    // db 접속
    this.dbConnection();

    // routing
    this.getRouting();

    // 정적 위치
    this.setStatic();

    // 로컬??
    this.setLocals();
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
    dotenv.config();
  }

  setSession() {
    this.app.sessionMiddleWare = session({
      secret: 'bblack_hun',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 2000 * 60 * 60,
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        collection: 'session',
      }),
    });

    // this.app.use(cookiParser('bblack_hun'));
    this.app.use(this.app.sessionMiddleware);

    // passport 적용
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // flash 메시지 관련
    this.app.use(flash);
  }
  setStatic() {
    this.app.use('/server/uploads', express.static('uploads'));
  }

  setLocals() {
    // 탬플릿 변수
    this.app.use((req, res, next) => {
      // 로그인 상태
      this.app.locals.isLogin = req.isAuthenticated();

      // 현재 접속자 정보
      this.app.locals.currentUser = req.user;

      // get 변수 받기
      this.app.locals.req_query = req.query;

      next();
    });
  }

  getRouting() {
    this.app.use(require('./server/controller'));
  }
}

module.exports = new App().app;
