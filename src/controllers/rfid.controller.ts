import { getRfidByTag } from './../services/rfid.service';
import { type Request, type Response } from 'express'
import { getAllRdifs, getRfidByUuid, } from '../services/rfid.service'

export const getAllRdifsHandler = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const pageNumber = parseInt(req.query.pageNumber as string)
        const pageSize = parseInt(req.query.pageSize as string)
        const order = req.query.order as string
        const onlyFloating = req.query.onlyFloating === 'true'

        const feedback = await getAllRdifs(pageNumber, pageSize, order, onlyFloating)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message ?? 'default.message'),
            data: {
                pageNumber: feedback.pageNumber,
                pageSize: feedback.pageSize,
                totalItemCount: feedback.totalItemCount,
                items: feedback.items
            }        })
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

export const getRfidByUUIDHandler = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const userUUID = req.params.uuid
        const feedback = await getRfidByUuid(userUUID)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message ?? 'default.message'),
            data: feedback.data
        })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: req.t(error.name),
                message: req.t(error.message)
            })
        }

        throw error
    }
}

export const getRfidByTagHandler = async(
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const tag = req.params.rfidTag
        const feedback = await getRfidByTag(tag)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message ?? 'default.message'),
            data: feedback.data
        })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: req.t(error.name),
                message: req.t(error.message)
            })
        }

        throw error
    }
}
