import { createClient, RedisClientType, RedisClientOptions, RedisModules, RedisScripts } from '@node-redis/client';

import l from './logger';

export function createRedisClient(url: string): RedisClientType<RedisModules, RedisScripts> {
    const clientOptions: RedisClientOptions<RedisModules, RedisScripts> = {
        url: url,
        socket: {
            connectTimeout: 500,
            reconnectStrategy: retries => Math.min(retries * 50, 500)
        }
    }

    const client: RedisClientType<RedisModules, RedisScripts> = createClient(clientOptions);
    
    client.on('connect', () => l.info('Redis client is connecting to the server'))
    client.on('ready', () => l.info('Redis client connected'))
    client.on('reconnecting', () => l.warn('Redis connection lost - reconnecting...'));
    client.on('error', (err) => l.error(`Redis client error: ${err}`));
    client.on('end', (err) => l.error('Redis client received shutdown signal'));

    return client;
}
