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

    // 환경변수
    dotenv.config();

    // 미들웨어 세팅
    this.setMiddleWare();

    // 세션 세팅
    this.setSession();

    // db 접속
    this.dbConnection();

    // routing
    this.getRouting();

    // 정적 위치
    this.setStatic();

    // 로컬??
    this.setLocals();

    // 404 페이지를 찾을 수 없음.
    this.status404();

    // 에러처리
    this.errorHandler();
  }

  dbConnection() {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch((err) => {
        console.error('Unable to connect to the database', err);
        process.exit(1);
      });
  }

  setMiddleWare() {
    // 미들웨어 세팅
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookiParser());
  }

  setSession() {
    this.app.sessionMiddleware = session({
      secret: 'bblack_hun',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 2000 * 60 * 60,
      },
      store: new MongoStore({
        url: process.env.MONGO_URL,
        collection: 'sessions',
      }),
    });
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
  status404() {
    this.app.use((req, res, _) => {
      res.status(404).json('Error');
    });
  }

  errorHandler() {
    this.app.use((err, req, res, _) => {
      res.status(500).json('500 Error');
    });
  }
}

module.exports = new App().app;
