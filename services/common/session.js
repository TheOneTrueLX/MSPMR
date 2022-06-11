import session from 'express-session'
import { createClient } from 'redis'
import connectRedis from 'connect-redis'


export default function sessionMiddlewareFactory(app) {
    const redisOptions = {
        url: process.env.REDIS_SESSION_URL
    }
    
    const RedisStore = connectRedis(session)
    const redisClient = createClient(redisOptions)
    redisClient.connect().catch(console.error)

    const sessionOptions = {
        store: new RedisStore({ client: redisClient }),
        secret: process.env.API_SECRET,
        resave: false,
        saveUninitialized: false,
        logErrors: true,
        unset: 'destroy'
    }

    app.use(session(sessionOptions))
}

export function socketIoSessionMiddlewareFactory(io) {
    const wrap = middleware => (socket, next) => middleware(socket.request, {}, next)

    const redisOptions = {
        url: process.env.REDIS_SESSION_URL
    }
    
    const RedisStore = connectRedis(session)
    const redisClient = createClient(redisOptions)
    redisClient.connect().catch(console.error)

    const sessionOptions = {
        store: new RedisStore({ client: redisClient }),
        secret: process.env.API_SECRET,
        resave: false,
        saveUninitialized: false,
        logErrors: true,
        unset: 'destroy'
    }
    
    const sessionMiddleware = session(sessionOptions)

    io.use(wrap(session))
}