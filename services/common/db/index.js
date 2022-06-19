import dbconfig from '../../knexfile.js';
import knex from 'knex';
import { logger } from '../logger.js'

const dblogging = {
    log: {
        warn(message) {
            logger.warn(message);
        },
        error(message) {
            logger.error(message);
        },
        deprecate(message) {
            logger.warn(message);
        },
        debug(message) {
            logger.debug(message);
        }
    }
}

const db = knex(Object.assign({}, dbconfig, dblogging));

export default db;