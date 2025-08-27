import {IUser} from '@/types'
import {IUserDocument, User} from '@/models/User'

export const createUser = async (userData: Partial<IUser>): Promise<IUserDocument> => {
    const user = await User.create(userData)
    return user
}

export const getAllUsers = async (): Promise<IUserDocument[]> => {
    const users = await User.find()
    return users
}

export const getUserById = async (id: string): Promise<IUserDocument | null> => {
    const user = await User.findById(id)
    return user
}

export const updateUser = async (
    id: string,
    userData: Partial<IUser>
): Promise<IUserDocument | null> => {
    const user = await User.findByIdAndUpdate(id, userData, {new: true})
    return user
}

export const deleteUser = async (id: string): Promise<IUserDocument | null> => {
    const user = await User.findByIdAndDelete(id)
    return user
}

export const getUserByEmail = async (email: string): Promise<IUserDocument | null> => {
    const user = await User.findOne({email}).select('+password')
    return user
}
