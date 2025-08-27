import {Router} from 'express'
import {getServerInfo} from '@/controllers/infoController'

const router = Router()

router.get('/info', getServerInfo)

export default router
