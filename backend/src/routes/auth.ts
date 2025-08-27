import {Router, Response} from 'express'
import {registerUser, loginUser} from '../controllers/userController'
import {authenticate} from '@/middleware/auth'
import {AuthenticatedRequest} from '@/types'
import {createUserResponse} from '@/utils/typeHelpers'

const router = Router()

// Public auth routes
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', (_req, res) => {
    // JWT logout is handled client-side, just return success
    res.json({success: true, message: 'Logged out successfully'})
})

// Protected auth routes
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
    // Return current user info with consistent response structure
    res.json(createUserResponse({user: req.user}, 'User info retrieved successfully'))
})

export default router
