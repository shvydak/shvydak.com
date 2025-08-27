import {createClient, RedisClientType} from 'redis'
import {redisConfig} from '@/config'

/**
 * Redis connection utility class
 * Handles Redis connection with proper error handling and reconnection logic
 */
export class RedisConnection {
    private static instance: RedisConnection
    private client: RedisClientType | null = null
    private isConnected = false

    private constructor() {}

    /**
     * Get singleton instance of RedisConnection
     */
    public static getInstance(): RedisConnection {
        if (!RedisConnection.instance) {
            RedisConnection.instance = new RedisConnection()
        }
        return RedisConnection.instance
    }

    /**
     * Connect to Redis with proper error handling
     */
    public async connect(): Promise<void> {
        if (this.isConnected && this.client) {
            console.log('Redis already connected')
            return
        }

        try {
            // Create Redis client
            const clientOptions: any = {
                url: redisConfig.url,
                socket: {
                    connectTimeout: 10000,
                },
            }

            if (redisConfig.password) {
                clientOptions.password = redisConfig.password
            }

            this.client = createClient(clientOptions)

            // Handle connection events
            this.client.on('connect', () => {
                console.log('🔄 Connecting to Redis...')
            })

            this.client.on('ready', () => {
                this.isConnected = true
                console.log('✅ Redis connected successfully')
            })

            this.client.on('error', (error) => {
                console.error('❌ Redis connection error:', error)
                this.isConnected = false
            })

            this.client.on('end', () => {
                console.log('⚠️ Redis connection ended')
                this.isConnected = false
            })

            this.client.on('reconnecting', () => {
                console.log('🔄 Redis reconnecting...')
            })

            // Connect to Redis
            await this.client.connect()
        } catch (error) {
            console.error('❌ Failed to connect to Redis:', error)
            throw error
        }
    }

    /**
     * Disconnect from Redis
     */
    public async disconnect(): Promise<void> {
        if (!this.client || !this.isConnected) {
            return
        }

        try {
            await this.client.quit()
            this.isConnected = false
            console.log('✅ Redis disconnected successfully')
        } catch (error) {
            console.error('❌ Error disconnecting from Redis:', error)
            throw error
        }
    }

    /**
     * Get Redis client instance
     */
    public getClient(): RedisClientType {
        if (!this.client || !this.isConnected) {
            throw new Error('Redis client not connected')
        }
        return this.client
    }

    /**
     * Get connection status
     */
    public getConnectionStatus(): boolean {
        return this.isConnected
    }

    /**
     * Set key-value pair with optional expiration
     */
    public async set(key: string, value: string, expireSeconds?: number): Promise<void> {
        const client = this.getClient()
        if (expireSeconds) {
            await client.setEx(key, expireSeconds, value)
        } else {
            await client.set(key, value)
        }
    }

    /**
     * Get value by key
     */
    public async get(key: string): Promise<string | null> {
        const client = this.getClient()
        return await client.get(key)
    }

    /**
     * Delete key
     */
    public async del(key: string): Promise<number> {
        const client = this.getClient()
        return await client.del(key)
    }

    /**
     * Check if key exists
     */
    public async exists(key: string): Promise<number> {
        const client = this.getClient()
        return await client.exists(key)
    }

    /**
     * Set expiration time for key
     */
    public async expire(key: string, seconds: number): Promise<boolean> {
        const client = this.getClient()
        return await client.expire(key, seconds)
    }

    /**
     * Get time to live for key
     */
    public async ttl(key: string): Promise<number> {
        const client = this.getClient()
        return await client.ttl(key)
    }
}

// Export singleton instance
export const redisConnection = RedisConnection.getInstance()
