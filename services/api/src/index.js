require('dotenv').config()

// external modules
const express = require('express')
const bodyParser = require('body-parser')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')

// internal modules
const httpServerFactory = require('./lib/http.js')
const { corsMiddlewareFactory } = require('./lib/cors.js')
const io = require('./lib/socketio.js')
const { logger, httpLoggerMiddlewareFactory } = require('./lib/logger.js')

// routers go here
const gamesRouter = require('./routers/games.js')
const platformsRouter = require('./routers/platforms.js')
const igdbRouter = require('./routers/igdb.js')
const incentivesRouter = require('./routers/incentives.js')
const spinlogRouter = require('./routers/spinlog.js')
const streamdeckRouter = require('./routers/streamdeck.js')
const workingRouter = require('./routers/working-games.js')
const submissionRouter = require('./routers/submissions')

// I question if this will actually work...
const pkginfo = require('../package.json')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
httpLoggerMiddlewareFactory(app, process.env.LOG_PATH)
corsMiddlewareFactory(app, `https://${process.env.HOST}:${process.env.FRONTEND_PORT}`)

app.get('/', (req, res) => {
    res.json({ 'service': process.env.SERVICE_NAME, 'version': pkginfo.version }).end()
})

const httpServer = httpServerFactory(app)
io.attach(httpServer)

// Set up API route imports here
const api_prefix = process.env.API_PREFIX
app.use(`${api_prefix}/games`, gamesRouter)
app.use(`${api_prefix}/igdb`, igdbRouter)
app.use(`${api_prefix}/platforms`, platformsRouter)
app.use(`${api_prefix}/spinlog`, spinlogRouter)
app.use(`${api_prefix}/incentives`, incentivesRouter)
app.use(`${api_prefix}/streamdeck`, streamdeckRouter)
app.use(`${api_prefix}/working`, workingRouter)
app.use(`${api_prefix}/submissions`, submissionRouter)

// catchall for 404 handling
app.all('*', (req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, message: ReasonPhrases.NOT_FOUND }).end()
})

httpServer.listen(Number(process.env.PORT), process.env.HOST, () => {
    logger.info(`Server is listening at https://${process.env.HOST}:${process.env.PORT}`)
})

// Finally, deal with any unhandled exceptions that pop up
process.on('uncaughtException', (err) => {
    logger.error(err)
    process.exit(1)
})

process.on('unhandledRejection', (err) => {
    logger.error(err)
    process.exit(1)
})