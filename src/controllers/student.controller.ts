import { Request, Response } from 'express'
import { createStudent, getAllStudents, getStudentByUUID } from '../services/student.service'

export const createStudentHandler = async (req: Request, res: Response) => {
    try {
        const { user, student } = req.body
        const feedback = await createStudent(user, student)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message|| 'default.message'),
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

export const getAllStudentsHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const pageNumber = parseInt(req.query.pageNumber as string)
        const pageSize = parseInt(req.query.pageSize as string)
        const order = req.query.order as string

        const feedback = await getAllStudents(pageNumber, pageSize, order)

        return res.status(feedback.statusCode).json({
            pageNumber: feedback.items,
            pageSize: feedback.pageSize,
            totalItemCount: feedback.totalItemCount,
            items: feedback.items,
            message: req.t('student.studentsRetrieved')
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

export const getStudentByUUIDHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const studentUUID = req.params.uuid
        const feedback = await getStudentByUUID(studentUUID)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message || 'default.message'),
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
