import cors from 'cors'

function corsMiddlewareFactory(app, origin) {
    const corsOptions = {
        origin: origin,
        methods: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
        optionsSuccessStatus: 204,
        credentials: true,
        exposedHeaders: ['set-cookie']
    }

    app.use(cors(corsOptions))
}

export default corsMiddlewareFactory