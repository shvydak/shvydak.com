import {IUser, UserRole, ApiResponse} from '../types'

// Utility functions using our types
export function createUserResponse<T>(data: T, message?: string): ApiResponse<T> {
    const response: ApiResponse<T> = {
        success: true,
        data,
    }

    if (message) {
        response.message = message
    }

    return response
}

export function createErrorResponse(error: string, message?: string): ApiResponse<never> {
    const response: ApiResponse<never> = {
        success: false,
        error,
    }

    if (message) {
        response.message = message
    }

    return response
}

export function validateUserData(user: unknown): user is IUser {
    return (
        typeof user === 'object' &&
        user !== null &&
        'email' in user &&
        'firstName' in user &&
        'lastName' in user &&
        'role' in user
    )
}

export function isAdminUser(user: IUser): boolean {
    return user.role === UserRole.ADMIN
}
