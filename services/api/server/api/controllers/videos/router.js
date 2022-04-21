import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/:channel_id', controller.all)
  .delete('/:id', controller.delete);
