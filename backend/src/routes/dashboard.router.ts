import {Router} from 'express'
import {authenticate} from '@/middleware/auth'
import {AuthenticatedRequest} from '@/types'

const router = Router()

// Dashboard endpoint that frontend expects
router.get('/', authenticate, (req: AuthenticatedRequest, res) => {
    const services = [
        {name: 'Immich Photos', status: 'online', url: 'http://photos.shvydak.com'},
        {name: 'Portainer', status: 'online', url: 'http://portainer.shvydak.com'},
        {name: 'n8n', status: 'online', url: 'http://n8n.shvydak.com'},
        {name: 'Home Assistant', status: 'offline', url: 'http://homeassistant.shvydak.com'},
        {name: 'Pi-hole', status: 'online', url: 'http://pihole.shvydak.com/admin'},
        {name: 'Plex', status: 'online', url: 'http://plex.shvydak.com'},
        {name: 'Transmission', status: 'online', url: 'http://torrents.shvydak.com'},
    ]

    res.json({
        success: true,
        message: `Welcome to the dashboard, ${req.user?.username || req.user?.email?.split('@')[0]}!`,
        user: req.user?.username || req.user?.email?.split('@')[0],
        services,
    })
})

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    })
})

export default router
