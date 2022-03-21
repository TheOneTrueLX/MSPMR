import { createClient, RedisClientType, RedisClientOptions, RedisModules, RedisScripts } from '@node-redis/client';

import l from './logger';

const clientOptions: RedisClientOptions<RedisModules, RedisScripts> = {
    url: process.env.REDIS_URI,
    socket: {
        connectTimeout: 500,
        reconnectStrategy: retries => Math.min(retries * 50, 500)
    }
}

const redisClient: RedisClientType<RedisModules, RedisScripts> = createClient(clientOptions);

redisClient.on('connect', () => l.info('Redis client is connecting to the server'))
redisClient.on('ready', () => l.info('Redis client connected'))
redisClient.on('reconnecting', () => l.warn('Redis connection lost - reconnecting...'));
redisClient.on('error', (err) => l.error(`Redis client error: ${err}`));
redisClient.on('end', () => l.error('Redis client received shutdown signal'));

redisClient.connect();

export default redisClient;