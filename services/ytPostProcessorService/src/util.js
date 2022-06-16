import db from '../../common/db'
import { logger } from '../../common/logger.js'

// TODO: refactor as necessary
export async function getCurrentVideoSortIndex(channel_id) {
    try {
      const sort_index = await db('videos').max('sort_index as max_sort').where('channels_id', channel_id).andWhere('status', 'processed')
      if(sort_index[0].max_sort) {
        return (sort_index[0].max_sort + 1)
      } else {
        return 1
      }
    } catch (e) {
      l.error(`Unable to get sort index for channel ${channel_id}: ${e}`)
      l.debug(e.stack)
      throw(e)
    }
  }