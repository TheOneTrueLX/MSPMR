import l from '../../common/logger';
import db from '../../db';

class VideosService {
  async all(req) {
    l.info(`${this.constructor.name}.all()`);
    var videos;
    try {
      videos = await db('videos').where('channels_id', req.session.user.current_channel)
    } catch (e) {
      l.error(`MSPMR DB error: ${e}`)
      throw(e);
    }
    return videos;
  }

  delete(req) {
    return db(videos).where('id', req.params.id).delete('id');
  }
}

export default new VideosService();
