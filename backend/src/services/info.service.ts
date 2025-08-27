export interface ServerInfo {
    status: string
    timestamp: string
    uptime: number
    version: string
    memory: {
        used: number
        total: number
    }
    nodeVersion: string
}

export const returnServerInfo = (): ServerInfo => {
    return {
        status: 'running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
        memory: {
            used: process.memoryUsage().heapUsed,
            total: process.memoryUsage().heapTotal,
        },
        nodeVersion: process.version,
    }
}
