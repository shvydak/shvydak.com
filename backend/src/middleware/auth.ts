import {serverConfig} from '@/config'
import {User} from '@/models/users.model'
import {AppError, AuthenticatedRequest} from '@/types'
import {NextFunction, Request, Response} from 'express'
import jwt from 'jsonwebtoken'

/**
 * Authentication middleware
 * Validates JWT token and attaches user to request object
 */
export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from Authorization header
        const authHeader = (req.headers as any).authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Access denied. No token provided.', 401)
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.substring(7)

        if (!token) {
            throw new AppError('Access denied. No token provided.', 401)
        }

        // Verify token
        const decoded = jwt.verify(token, serverConfig.jwtSecret) as any

        // Check if user still exists
        const user = await User.findById(decoded.userId).select('+password')

        if (!user) {
            throw new AppError('User no longer exists.', 401)
        }

        // Check if user is active
        if (!user.isActive) {
            throw new AppError('User account is deactivated.', 401)
        }

        // Attach user to request object
        // eslint-disable-next-line no-extra-semi
        ;(req as any).user = user as any
        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError('Invalid token.', 401))
        } else if (error instanceof jwt.TokenExpiredError) {
            next(new AppError('Token expired.', 401))
        } else {
            next(error)
        }
    }
}

/**
 * Authorization middleware
 * Checks if user has required role
 */
export const authorize = (...roles: string[]) => {
    return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new AppError('User not authenticated.', 401))
            return
        }

        if (!roles.includes(req.user.role)) {
            next(new AppError('Access denied. Insufficient permissions.', 403))
            return
        }

        next()
    }
}

/**
 * Optional authentication middleware
 * Similar to authenticate but doesn't throw error if no token provided
 */
export const optionalAuth = async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = (req.headers as any).authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next()
        }

        const token = authHeader.substring(7)

        if (!token) {
            return next()
        }

        const decoded = jwt.verify(token, serverConfig.jwtSecret) as any
        const user = await User.findById(decoded.userId)

        if (user && user.isActive) {
            req.user = user as any
        }

        next()
    } catch (error) {
        // Don't throw error for optional auth, just continue
        next()
    }
}
