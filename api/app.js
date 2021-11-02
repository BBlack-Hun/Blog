const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const cookiParser = require('cookie-parser');
const dotenv = require('dotenv');

// flash
const flash = require('connect-flash');

// db
// const db = require('./models');

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
    this.app.use(flash);
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
