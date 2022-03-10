import express from 'express';
import { Application } from 'express';
import { Server } from 'socket.io';
import path from 'path';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import os from 'os';
import cookieParser from 'cookie-parser';
import swaggerify from './swagger';
import l from './logger';
import Mongoose from './mongoose'
import initSocketHandlers from '../api/sockets';

const app = express();
const io = new Server();
const mongoose = new Mongoose;

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT']
}

export default class ExpressServer {
  constructor() {
    const root = path.normalize(__dirname + '/../..');
    app.set('appPath', root + 'client');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(express.static(`${root}/public`));

    app.use(cors(corsOptions))
    
    initSocketHandlers(io)
  }

  router(routes: (app: Application) => void): ExpressServer {
    swaggerify(app, routes);
    return this;
  }

  listen(p: string | number = process.env.PORT): Application {
    const welcome = port => () => l.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname() } on port: ${port}}`);
    const httpServer = http.createServer(app)
    io.attach(httpServer, { cors: corsOptions })   
    httpServer.listen(p, welcome(p));
    mongoose.init();
    return app;
  }
}
