export default {
    origin: 'https://localhost:3000',
    methods: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
    optionsSuccessStatus: 204,
    credentials: true,
    exposedHeaders: ['set-cookie']
}