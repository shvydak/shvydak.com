import {
    createUser,
    deleteUser,
    getAllUsers,
    getUserByEmail,
    getUserById,
    updateUser,
} from '@/services/users.service'
import {IUser} from '@/types'
import {generateToken} from '@/utils/jwt'
import {Request, Response} from 'express'
import {createErrorResponse, createUserResponse} from '../utils/typeHelpers'

export const registerUser = async (req: Request, res: Response) => {
    try {
        const userData = req.body
        const user = await createUser(userData)

        const token = generateToken(user as IUser)

        return res
            .status(201)
            .json(createUserResponse({user, token}, 'User registered successfully'))
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return res.status(400).json(createErrorResponse('Registration failed', errorMessage))
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const {username, email, password} = req.body

        // Support login by username (treated as email prefix) or email
        let user = null
        if (username) {
            // Try to find user by matching email prefix
            const users = await getAllUsers()
            user = users.find((u) => u.email.split('@')[0] === username)
            // If found by username, we need to fetch the user with password included
            if (user) {
                const User = (await import('@/models/users.model')).User
                user = await User.findById(user.id).select('+password')
            }
        } else if (email) {
            user = await getUserByEmail(email)
        }

        if (!user) {
            return res.status(401).json(createErrorResponse('Invalid credentials'))
        }

        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
            return res.status(401).json(createErrorResponse('Invalid credentials'))
        }

        const token = generateToken(user as IUser)

        return res.status(200).json(createUserResponse({user, token}, 'Login successful'))
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return res.status(500).json(createErrorResponse('Login failed', errorMessage))
    }
}

export const getAllUsersHandler = async (_req: Request, res: Response) => {
    try {
        const users = await getAllUsers()
        return res.status(200).json(createUserResponse(users, 'Users fetched successfully'))
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return res.status(500).json(createErrorResponse('Failed to fetch users', errorMessage))
    }
}

export const getUserByIdHandler = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const user = await getUserById(id as string)

        if (!user) {
            return res.status(404).json(createErrorResponse('User not found'))
        }

        return res.status(200).json(createUserResponse(user, 'User fetched successfully'))
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return res.status(500).json(createErrorResponse('Failed to fetch user', errorMessage))
    }
}

export const getUserByEmailHandler = async (req: Request, res: Response) => {
    try {
        const {email} = req.params
        const user = await getUserByEmail(email as string)
        return res.status(200).json(createUserResponse(user, 'User fetched successfully'))
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return res.status(500).json(createErrorResponse('Failed to fetch user', errorMessage))
    }
}

export const updateUserHandler = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const userData = req.body
        const user = await updateUser(id as string, userData)
        return res.status(200).json(createUserResponse(user, 'User updated successfully'))
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return res.status(500).json(createErrorResponse('Failed to update user', errorMessage))
    }
}

export const deleteUserHandler = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const user = await deleteUser(id as string)
        return res.status(200).json(createUserResponse(user, 'User deleted successfully'))
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return res.status(500).json(createErrorResponse('Failed to delete user', errorMessage))
    }
}
