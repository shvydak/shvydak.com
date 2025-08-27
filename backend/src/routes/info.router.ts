import {Router} from 'express'
import {getServerInfo} from '@/controllers/info.controller'

const router = Router()

router.get('/info', getServerInfo)

export default router
