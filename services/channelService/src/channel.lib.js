import { logger } from '../../common/logger.js'
import db from '../../common/db/index.js'

export function getUserChannels(user) {
    return new Promise(async (resolve,reject) => {
        try {
            // we need to assemble an array from two disparate tables
            // and I'd rather not do it with a union query because
            // those are expensive, so we do the data manipulation here
            var results = []
            
            const primary_channel = await db.select('a.id', 'b.username')
            .from('channels as a')
            .leftJoin('users as b', 'a.owner_id', 'b.id')
            .where('b.id', req.session.user.id)
          
            results.push({ channel_id: primary_channel[0].id, channel_name: req.session.user.username, user_status: 'owner' })

            const mod_channels = await db.select('c.id', 'd.username')
            .from('users as a')
            .leftJoin('users_channels as b', 'a.id', 'b.users_id')
            .leftJoin('channels as c', 'b.channels_id', 'c.id')
            .leftJoin('users as d', 'c.owner_id', 'd.id')
            .where('a.id', req.session.user.id);

            mod_channels.forEach((channel) => {
                if(channel.id !== null && channel.username !== null) {
                    results.push({ channel_id: channel.channels_id, channel_name: channel.username, user_status: 'mod' })
                }
            })

            resolve(results)

        } catch (err) {
            reject(Error('Could not fecth user\'s channels', { cause: err }))
        }
    })
}

export function setCurrentChannel(user, channel_id) {
    return new Promise(async (resolve,reject) => {
        try {
            // This method will not permit a user to change to a channel that they 
            // are not either an owner or moderator for. 
            const own_channel = await db('channels').select('id').where('owner_id', user.id)
            const channel_list = await db('users_channels').select('channels_id').where('users_id', user.id)

            if((own_channel[0].owner_id == channel_id) || (channel_list.find(o => o.channel_id == channel_id))) {
                // if the change is permitted, update the table and the session object
                await db('users').update('current_channel', channel_id).where('id', user.id);
                user.current_channel = channel_id
            }
            
            resolve(user)
        } catch (err) {
            reject(Error('Could not update user\'s current channel', { cause: err }))
        }
    })
}