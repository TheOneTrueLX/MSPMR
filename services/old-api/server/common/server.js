import Express from 'express'
// import cookieParser from 'cookie-parser'
import routes from './routes'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as http from 'https'
import corsOptions from './cors'
import cors from 'cors'
import * as os from 'os'
import Server from 'socket.io'
import { socketOptions, socketConnectionHandler, socketErrorHandler, socketAuthMiddleware, socketMiddlewareWrapper } from './socketio'
// import ioSingleton from './socketio'
import morgan from 'morgan'
import l from './logger'
import fs from 'fs'
import sessionMiddleware from './session'
import db from '../db'
import { resourceLimits } from 'worker_threads'

const app = new Express()

const httpOptions = {
  key: fs.readFileSync('../../etc/mspmr.key'),
  cert: fs.readFileSync('../../etc/mspmr.crt')
}

export const io = Server(socketOptions)
io.use(socketMiddlewareWrapper(sessionMiddleware))
io.use(socketAuthMiddleware)
io.on('connection', socketConnectionHandler)
io.on('error', socketErrorHandler)

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`)  

    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || '100kb' }))
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || '100kb',
      })
    )
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || '100kb' }))
    app.use(sessionMiddleware)
    app.use(cors(corsOptions))
    app.use(morgan('combined'))
      
    // initialize route
    routes(app)
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () =>
      l.info(
        `up and running in ${
          process.env.NODE_ENV || 'development'
        } @: ${os.hostname()} on port: ${p}`
      )

    try {
      const httpServer = http.createServer(httpOptions, app)
      io.attach(httpServer)
      httpServer.listen(port, welcome(port))
    } catch (e) {
      l.error(e)
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    }

    return app
  }
}