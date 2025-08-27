import {Request} from 'express'

// User related types
export interface IUser {
    _id?: string
    username?: string
    email: string
    password: string
    firstName?: string
    lastName?: string
    role: UserRole.USER | UserRole.ADMIN
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

// Request and Response types
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

// Authentication types
export interface LoginRequest {
    username?: string
    email?: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    firstName: string
    lastName: string
}

export interface AuthResponse {
    user: Omit<IUser, 'password'>
    token: string
}

// Express request extensions
export interface AuthenticatedRequest extends Request {
    user?: IUser
}

// Error types
export class AppError extends Error {
    public statusCode: number
    public isOperational: boolean

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

// Database types
export interface DatabaseConfig {
    uri: string
    options: {
        maxPoolSize: number
        serverSelectionTimeoutMS: number
        socketTimeoutMS: number
    }
}

// Redis types
export interface RedisConfig {
    url: string
    password?: string | undefined
    retryDelayOnFailover: number
    maxRetriesPerRequest: number
}

// Server configuration
export interface ServerConfig {
    port: number
    nodeEnv: string
    corsOrigin: string
    jwtSecret: string
    jwtExpiresIn: string
}

// User types
export type CreateUserRequest = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>

export type UpdateUserRequest = Partial<Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>>

export type PublicUserProfile = Pick<
    IUser,
    'email' | 'firstName' | 'lastName' | 'role' | 'isActive'
>

// Type Guards
export function isString(value: unknown): value is string {
    return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
    return typeof value === 'number'
}

export function isUser(value: unknown): value is IUser {
    return (
        typeof value === 'object' &&
        value !== null &&
        'email' in value &&
        'firstName' in value &&
        'lastName' in value
    )
}
