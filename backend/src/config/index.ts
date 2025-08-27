import dotenv from 'dotenv'
import {ServerConfig, DatabaseConfig, RedisConfig} from '@/types'

// Load environment variables
dotenv.config()

// Validate required environment variables (make most optional for ease of setup)
const requiredEnvVars = ['JWT_SECRET']

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.warn(`Warning: Missing environment variable: ${envVar}. Using default.`)
    }
}

// JWT Configuration
export const jwtConfig = {
    secret: process.env['JWT_SECRET'] || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env['JWT_EXPIRES_IN'] || '24h',
} as const

// Server configuration
export const serverConfig: ServerConfig = {
    port: parseInt(process.env['PORT'] || '7777', 10), // Changed to match frontend expectation
    nodeEnv: process.env['NODE_ENV'] || 'development',
    corsOrigin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
    jwtSecret: process.env['JWT_SECRET'] || 'default-jwt-secret-change-in-production',
    jwtExpiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
}

// Database configuration
export const databaseConfig: DatabaseConfig = {
    uri: process.env['MONGODB_URI'] || 'mongodb://localhost:20777/shvydak_backend',
    options: {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    },
}

// Redis configuration
export const redisConfig: RedisConfig = {
    url: process.env['REDIS_URL'] || 'redis://localhost:6377',
    password: process.env['REDIS_PASSWORD'],
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
}

// Rate limiting configuration
export const rateLimitConfig = {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 100), // 15 minutes
    max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10), // limit each IP to 100 requests per windowMs
}

// Logging configuration
export const loggingConfig = {
    level: process.env['LOG_LEVEL'] || 'info',
}

// Export all configurations
export const config = {
    server: serverConfig,
    database: databaseConfig,
    redis: redisConfig,
    rateLimit: rateLimitConfig,
    logging: loggingConfig,
    jwt: jwtConfig,
}

export default config
