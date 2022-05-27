import Express from 'express';
// import cookieParser from 'cookie-parser';
import routes from './routes';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'https';
import cors from 'cors';
import * as os from 'os';
import socketio from 'socket.io';
import morgan from 'morgan';
import l from './logger';
import fs from 'fs';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import db from '../db';
import io from './socketio'

const app = new Express();

const corsOptions = {
  origin: 'https://localhost:3000',
  methods: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
  optionsSuccessStatus: 204,
  credentials: true,
  exposedHeaders: ['set-cookie']
}

const httpOptions = {
  key: fs.readFileSync('../../etc/mspmr.key'),
  cert: fs.readFileSync('../../etc/mspmr.crt')
}

const sessionStoreOptions = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

const sessionStore = new MySQLStore(sessionStoreOptions);

const sessionOptions = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  cookie: {
    // (days * hours * minutes * seconds * milliseconds)
    maxAge: (7 * 24 * 60 * 60 * 1000),
    secure: true,
    sameSite: 'strict',
  },
  saveUninitialized: false,
  resave: false,
  unset: 'destroy'
}

const ses = session(sessionOptions);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);  

    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb' }));
    // this allegedly isn't needed anymore
    // app.use(cookieParser());
    app.use(ses);
    app.use(cors(corsOptions));
    app.use(morgan('combined'));
       
    // initialize route
    routes(app);
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}`
      );

    try {
      const httpServer = http.createServer(httpOptions, app);
      io.use(wrap(ses));
      io.attach(httpServer, { cors: corsOptions });
      httpServer.listen(port, welcome(port));
    } catch (e) {
      l.error(e);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }

    return app;
  }
}
