import { Request, Response } from 'express'
import { getDashboardStats } from '../services/dashboard.service'

export const getDashboardStatsController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const stats = await getDashboardStats()
        res.status(stats.statusCode).json(stats)
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: error instanceof Error ? error.message : 'dashboard.statsRetrievalFailed'
        })
    }
} 