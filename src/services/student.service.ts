import { User } from '../entities/user.entity'
import { Student } from '../entities/student.entity'
import { hash } from 'bcrypt'
import { AppDataSource } from '../configs/db.config'

export const createStudent = async (userData: User, studentData: Student): Promise<{
    createdStudent: Student
    statusCode: number
    message: string
}> => {
    const userRepository = AppDataSource.getRepository(User)
    const studentRepository = AppDataSource.getRepository(Student)

    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
        // const existingEmail = await userRepository.findOne({
        //     where: {
        //         email: userData.email
        //     }
        // })

        // if (existingEmail) {
        //     throw new Error('user.emailAlreadyExists')
        // }

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
            createdStudent: savedStudent,
            statusCode: 201,
            message: 'student.studentCreated'
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