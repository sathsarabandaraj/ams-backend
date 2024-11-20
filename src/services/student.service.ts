import { User } from '../entities/user.entity'
import { Student } from '../entities/student.entity'
import { hash } from 'bcrypt'
import { AppDataSource } from '../configs/db.config'
import { IApiResult, IPaginatedApiResult } from '../types'

export const createStudent = async (userData: User, studentData: Student): Promise<IApiResult<Student>> => {
    const userRepository = AppDataSource.getRepository(User)
    const studentRepository = AppDataSource.getRepository(Student)

    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
        // Hash password if provided
        if (userData.password) {
            userData.password = await hash(userData.password, 10)
        }

        // Create and save user first
        const newUser = userRepository.create(userData)
        const savedUser = await userRepository.save(newUser)

        // Create student with the saved user
        const newStudent = studentRepository.create({
            ...studentData,
            user: savedUser
        })
        const savedStudent = await studentRepository.save(newStudent)

        await queryRunner.commitTransaction()

        return {
            statusCode: 201,
            message: 'student.studentCreated',
            data: savedStudent
        }
    } catch (error) {
        await queryRunner.rollbackTransaction()
        throw new Error(error instanceof Error
            ? error.message
            : 'student.studentCreationFailed'
        )
    } finally {
        await queryRunner.release()
    }
}

export const getAllStudents = async (pageNumber: number, pageSize: number, order?: string): Promise<IPaginatedApiResult<Student>> => {
    const studentRepository = AppDataSource.getRepository(Student)
    try {
        const [students, total] = await studentRepository.findAndCount({
            order: {
                created_at: order as 'ASC' | 'DESC' || 'DESC'
            },
            relations: ['user'],
            take: pageSize,
            skip: pageNumber * pageSize
        })

        if (students.length === 0) {
            return {
                statusCode: 404,
                message: 'student.studentsNotFound',
                pageNumber,
                pageSize,
                totalItemCount: 0,
                items: []
            }
        }

        return {
            statusCode: 200,
            message: 'student.studentsRetrieved',
            pageNumber,
            pageSize,
            totalItemCount: total,
            items: students,
        }

    } catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : 'student.studentsRetrievalFailed'
        )
    }
}

export const getStudentByUUID = async (studentUUID: string): Promise<IApiResult<Student>> => {
    const studentRepository = AppDataSource.getRepository(Student)
    try {
        const student = await studentRepository.findOne({
            where: {
                uuid: studentUUID
            },
            relations: ['user']
        })

        if (!student) {
            return {
                statusCode: 404,
                message: 'student.studentNotFound',
            }
        }

        return {
            statusCode: 200,
            message: 'student.studentRetrieved',
            data: student
        }
    } catch (error) {
        throw new Error(error instanceof Error
            ? error.message
            : 'student.studentRetrievalFailed'
        )
    }
}
