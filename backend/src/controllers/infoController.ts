import {Request, Response} from 'express'
import {returnServerInfo} from '@/services/infoService'

export const getServerInfo = (_req: Request, res: Response) => {
    const serverInfo = returnServerInfo()
    res.json(serverInfo)
}
