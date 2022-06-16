import dbconfig from '../../knexfile';
import knex from 'knex';
import { logger } from '../logger'

const dblogging = {
    log: {
        warn(message) {
            l.warn(message);
        },
        error(message) {
            l.error(message);
        },
        deprecate(message) {
            l.warn(message);
        },
        debug(message) {
            l.debug(message);
        }
    }
}

const db = knex(Object.assign({}, dbconfig, dblogging));

export default db;