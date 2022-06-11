import cors from 'cors'

function corsMiddlewareFactory(app) {
    const corsOptions = {
        origin: `https://${process.env.API_HOST}:${process.env.API_PORT}`,
        methods: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
        optionsSuccessStatus: 204,
        credentials: true,
        exposedHeaders: ['set-cookie']
    }

    app.use(cors(corsOptions))
}

export default corsMiddlewareFactory