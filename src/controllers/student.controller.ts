import { Request, Response } from 'express'
import { Student } from '../entities/student.entity'
import { createStudent } from '../services/student.service'
import { ApiResponse } from '../types'

export const createStudentHandler = async (req: Request, res: Response): Promise<ApiResponse<Student>> => {
    try {
        // Separate user and student data
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


// export const getAllStudentsHandler = async (req: Request, res: Response): Promise<PaginatedApiResponse<Student>> => {
//     try {
//         const pageNumber = parseInt(req.query.pageNumber as string)
//         const pageSize = parseInt(req.query.pageSize as string)
        
//         const { items, totalItemCount, statusCode, message } = await getAllMentors({
//             pageNumber,
//             pageSize
//         })

//         return res.status(statusCode).json({
//             pageNumber,
//             pageSize,
//             totalItemCount,
//             items,
//             message
//         })

//     } catch (error) {
//         if (error instanceof Error) {
//             return res.status(400).json({
//                 error: 'Internal server error',
//                 message: error.message
//             })
//         }

//         throw error
//     }
// }

