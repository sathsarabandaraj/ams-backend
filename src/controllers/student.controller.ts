import { Request, Response } from 'express'
import { Student } from '../entities/student.entity'
import { createStudent, getAllStudents } from '../services/student.service'
import { stat } from 'fs'

export const createStudentHandler = async (req: Request, res: Response) => {
    try {
        const { user, student } = req.body
        const { createdStudent, statusCode, message } = await createStudent(user, student)

        return res.status(statusCode).json({
            message: req.t(message),
            data: createdStudent
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

        const students = await getAllStudents(pageNumber, pageSize, order)

        return res.status(students.statusCode).json({
            pageNumber: pageNumber,
            pageSize: pageSize,
            totalItemCount: students.totalItemCount,
            items: students.items,
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

