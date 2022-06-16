import 'dotenv/config'
import path from 'path'
import * as url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'mspmr',
    password: 'quagmire',
    database: 'mspmr',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, './common/db/migrations')
  },
  seeds: {
    directory: path.join(__dirname, './common/db/seeds')
  },
  useNullAsDefault: true
};