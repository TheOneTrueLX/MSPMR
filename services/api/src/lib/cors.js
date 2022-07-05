const cors = require('cors')

const corsOptions = {
    origin: '',
    methods: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
    optionsSuccessStatus: 204,
    credentials: true,
    exposedHeaders: ['set-cookie']
}

function corsMiddlewareFactory(app, origin) {
    corsOptions.origin = origin;
    app.use(cors(corsOptions))
}

module.exports = {
    corsMiddlewareFactory,
    corsOptions
}