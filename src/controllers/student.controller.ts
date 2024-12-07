import { Request, Response } from 'express'
import { createStudent, deleteStudent, getAllStudents, getStudentByUUID, updateStudent } from '../services/student.service'
import { IUserUpdate } from '../types';

export const createStudentHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { user } = req.body;

        const feedback = await createStudent(user);

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message || 'default.message'),
            data: feedback.data
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: req.t(error.message),
                message: req.t('server.internalServerErr')
            });
        }

        throw error;
    }
};
 
export const getAllStudentsHandler = async (req: Request, res: Response): Promise<Response> => {
    try {
        const pageNumber = parseInt(req.query.pageNumber as string)
        const pageSize = parseInt(req.query.pageSize as string)
        const order = req.query.order as string

        const feedback = await getAllStudents(pageNumber, pageSize, order)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message || 'default.message'),
            data: {
                pageNumber: feedback.pageNumber,
                pageSize: feedback.pageSize,
                totalItemCount: feedback.totalItemCount,
                items: feedback.items,
            }
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
        const userUUID = req.params.uuid
        const feedback = await getStudentByUUID(userUUID)

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

export const updateStudentController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const {user} = req.body;
        const userUUID = req.params.uuid

        const feedback = await updateStudent(userUUID, user || {})

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message || 'default.message'),
            data: feedback.data
        })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: req.t(error.name),
                message: req.t(error.message)
            })
        }

        throw error
    }
}

// delete user controller
export const deleteStudentController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userUUID = req.params.uuid
        const feedback = await deleteStudent(userUUID)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message || 'default.message'),
            data: feedback.data
        })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({
                error: req.t(error.name),
                message: req.t(error.message)
            })
        }

        throw error
    }
}

