import { Sequelize } from 'sequelize';
import { initModels } from './entities/init-models'
import config from './config'
import l from '../common/logger';

const db = new Sequelize(config);

async () => {
    try {
        await db.authenticate();
        l.info('Database connection established');
    } catch (err) {
        l.error(`Error connecting to database: ${err}`);
    }
}

const models = initModels(db);

export default models;