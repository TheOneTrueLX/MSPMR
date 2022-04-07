import dbconfig from '../../knexfile';
import knex from 'knex';

const db = knex(dbconfig);

export default db;