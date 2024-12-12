import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './env.config';

const redisClient = createClient({
    url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
});

redisClient.connect().catch((error) => console.error("Redis connection error:", error));

export default redisClient;
