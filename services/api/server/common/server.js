import Express from 'express';
import cookieParser from 'cookie-parser';
import routes from './routes';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import * as http from 'http';
import cors from 'cors';
import * as os from 'os';
import morgan from 'morgan';
import l from './logger';

const app = new Express();

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
  optionsSuccessStatus: 204
}

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
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(cors(corsOptions));
    app.use(morgan('combined'))
       
    // initialize route
    routes(app);
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}}`
      );

    try {
      http.createServer(app).listen(port, welcome(port));
    } catch (e) {
      l.error(e);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }

    return app;
  }
}
