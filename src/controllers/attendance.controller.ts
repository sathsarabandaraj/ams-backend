import { Request, Response } from 'express'
import {
    getAllAttendance,
    getUserAttendance,
    markAttendance
} from '../services/attendance.service'

export const getAllAttendanceHandler = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const pageNumber = parseInt(req.query.pageNumber as string)
        const pageSize = parseInt(req.query.pageSize as string)
        const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
        const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

        const feedback = await getAllAttendance(pageNumber, pageSize, startDate, endDate)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message ?? 'default.message'),
            data: {
                pageNumber: feedback.pageNumber,
                pageSize: feedback.pageSize,
                totalItemCount: feedback.totalItemCount,
                items: feedback.items
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: req.t(error.message),
                message: req.t('server.internalServerErr')
            })
        }
        throw error
    }
}

export const getUserAttendanceHandler = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { userUuid } = req.params
        const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined
        const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined

        const feedback = await getUserAttendance(userUuid, startDate, endDate)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message ?? 'default.message'),
            data: feedback.data
        })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: req.t(error.message),
                message: req.t('server.internalServerErr')
            })
        }
        throw error
    }
}

export const markAttendanceHandler = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { userUuid, inOutStatus, rfidUuid, accessModuleUuid } = req.body

        const feedback = await markAttendance(userUuid, inOutStatus, rfidUuid, accessModuleUuid)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message ?? 'default.message'),
            data: feedback.data
        })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: req.t(error.message),
                message: req.t('server.internalServerErr')
            })
        }
        throw error
    }
} 