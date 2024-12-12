import dotenv from 'dotenv'

dotenv.config()

// Postgres Config
export const POSTGRES_HOST = process.env.POSTGRES_HOST || 'localhost'
export const POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || '5432')
export const POSTGRES_USER = process.env.POSTGRES_USER
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
export const POSTGRES_DB_NAME = process.env.POSTGRES_DB_NAME

// Redis Config
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379')
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD

// JWT Config
export const JWT_SECRET = process.env.JWT_SECRET || ""
export const JWT_EXPIRY = process.env.JWT_EXPIRY || '1d'

// AWS SES Config
export const AWS_SES_REGION = process.env.AWS_SES_REGION
export const AWS_SES_ACCESS_KEY_ID = process.env.AWS_SES_ACCESS_KEY_ID
export const AWS_SES_SECRET_ACCESS_KEY = process.env.AWS_SES_SECRET_ACCESS_KEY
export const AWS_SES_EMAIL = process.env.AWS_SES_EMAIL

// Server Config
export const SERVER_PORT = parseInt(process.env.SERVER_PORT || '3000')
export const APP_URL = process.env.APP_URL
export const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY || '300')

// Node Config
export const NODE_ENV = process.env.NODE_ENV || 'development'