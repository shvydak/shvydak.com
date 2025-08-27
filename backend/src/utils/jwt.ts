import jwt, {SignOptions} from 'jsonwebtoken'
import {IUser} from '@/types'
import {jwtConfig} from '@/config'

// Интерфейс для JWT payload
interface JWTPayload {
    userId: string
    email: string
    role: string
}

export const generateToken = (user: IUser): string => {
    const payload: JWTPayload = {
        userId: user._id as string,
        email: user.email,
        role: user.role,
    }

    return jwt.sign(
        payload,
        jwtConfig.secret as string,
        {
            expiresIn: jwtConfig.expiresIn as string,
            algorithm: 'HS256',
        } as SignOptions
    )
}

// Проверка JWT токена
export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, jwtConfig.secret) as JWTPayload
}
