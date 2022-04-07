require('dotenv').config();
const path = require('path');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'mspmr',
    password: 'changeme',
    database: 'mspmr',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, './server/db/migrations')
  },
  seeds: {
    directory: path.join(__dirname, './server/db/seeds')
  },
  useNullAsDefault: true
};