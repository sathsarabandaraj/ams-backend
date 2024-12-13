import { createClient } from 'redis'
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './env.config'

const redisClient = createClient({
  url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
})

redisClient.on('connect', () => {
  console.log('Successfully connected to Redis!')
})

redisClient.on('ready', () => {
  console.log('Redis client ready!')
})

redisClient.on('reconnecting', () => {
  console.log('Reconnecting to Redis...')
})

redisClient.on('end', () => {
  console.log('Redis connection closed!')
})

redisClient.on('error', (error) => { 
  console.error('Redis error:', error)
})

redisClient.connect().catch((error) => {
  console.error('Redis connection error:', error)
})

export default redisClient
