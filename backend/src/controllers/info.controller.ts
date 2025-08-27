import {Request, Response} from 'express'
import {returnServerInfo} from '@/services/info.service'

export const getServerInfo = (_req: Request, res: Response) => {
    const serverInfo = returnServerInfo()
    res.json(serverInfo)
}
