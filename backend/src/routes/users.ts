import {Router} from 'express'
import {
    getAllUsersHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler,
    getUserByEmailHandler,
} from '../controllers/userController'
import {authenticate} from '@/middleware/auth'

const router = Router()

// User management endpoints (protected)
router.get('/', authenticate, getAllUsersHandler)
router.get('/:id', authenticate, getUserByIdHandler)
router.get('/email/:email', authenticate, getUserByEmailHandler)
router.put('/:id', authenticate, updateUserHandler)
router.delete('/:id', authenticate, deleteUserHandler)

export default router
