import express from 'express';
import controller from './controller'
export default express.Router()
    .get('/user', controller.get)
    .get('/', controller.callback)
    .delete('/', controller.remove);