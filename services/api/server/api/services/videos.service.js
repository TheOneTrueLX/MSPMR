import l from '../../common/logger';
import db from '../../db';

class VideosService {
  async all(req) {
    l.info(`${this.constructor.name}.all()`);
    return db.all();
  }

  delete(req) {
    return db.delete(id);
  }
}

export default new VideosService();
