import { ContactInfo } from './../schemas/contact-info.schema';
import { User } from '../entities/user.entity'
import { hash } from 'bcrypt'
import { AppDataSource } from '../configs/db.config'
import { IApiResult, IPaginatedApiResult, IUserUpdate } from '../types'
import { AccoutStatus, UserType } from '../enums'
import { Student } from '../entities/student.entity';

export const createStudent = async (userData: User): Promise<IApiResult<User>> => {
    const userRepository = AppDataSource.getRepository(User)

    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
        if (userData.password) {
            userData.password = await hash(userData.password, 10)
        }

        const newUser = userRepository.create({
            ...userData,
            userType: UserType.STUDENT,
            accountStatus: AccoutStatus.ACTIVE
        })

        const savedUser = await userRepository.save(newUser)

        await queryRunner.commitTransaction()

        return {
            statusCode: 201,
            message: 'student.studentCreated',
            data: savedUser
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

export const getAllStudents = async (pageNumber: number, pageSize: number, order?: string): Promise<IPaginatedApiResult<User>> => {
    //get all users that are students
    const userRepository = AppDataSource.getRepository(User)
    try {
        const [students, total] = await userRepository.findAndCount({
            where: {
                userType: UserType.STUDENT
            },
            order: {
                created_at: order as 'ASC' | 'DESC' || 'DESC'
            },
            take: pageSize,
            skip: pageNumber * pageSize,
            relations: {
                student: true
            }
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


export const getStudentByUUID = async (userUUID: string): Promise<IApiResult<User>> => {
    const userRepository = AppDataSource.getRepository(User)
    try {
        const student = await userRepository.findOne({
            where: {
                uuid: userUUID,
                userType: UserType.STUDENT
            },
            relations: {
                student: true
            }
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

export const updateStudent = async (userUUID: string, updateData: Partial<User> ): Promise<IApiResult<User>> => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepository = AppDataSource.getRepository(User);

        // Find the existing student with specified relations
        const existingStudent = await userRepository.findOne({
            where: {
                uuid: userUUID,
                userType: UserType.STUDENT
            },
            relations: {
                student: {
                    guardian: true,
                    emergencyContact: true
                }
            }
        });

        // Check if student exists
        if (!existingStudent) {
            return {
                statusCode: 404,
                message: 'student.studentNotFound'
            };
        }

        // Prepare update object with deep merge
        const updatedStudentData = {
            ...existingStudent,
            ...updateData,
            // Carefully merge student-specific data
            student: {
                ...existingStudent.student,
                ...(updateData.student || {}),
                // Handle guardian updates
                guardian: updateData.student?.guardian
                    ? {
                        ...existingStudent.student?.guardian,
                        ...(updateData.student.guardian || {})
                    }
                    : existingStudent.student?.guardian,
                // Handle emergency contact updates
                emergencyContact: updateData.student?.emergencyContact
                    ? {
                        ...existingStudent.student?.emergencyContact,
                        ...(updateData.student.emergencyContact || {})
                    }
                    : existingStudent.student?.emergencyContact
            }
        };

        // Perform the update
        const updatedStudent = await userRepository.save(updatedStudentData);

        await queryRunner.commitTransaction();

        return {
            statusCode: 200,
            message: 'student.studentUpdated',
            data: updatedStudent
        };
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(error instanceof Error
            ? error.message
                : 'student.studentUpdateFailed'
        );
    } finally {
        // Always release the query runner
        await queryRunner.release();
    }
};

export const deleteStudent = async (userUUID: string): Promise<IApiResult<User>> => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const userRepository = AppDataSource.getRepository(User);
        const studentRepository = AppDataSource.getRepository(Student);

        // Find the existing student with specified relations
        const existingStudent = await userRepository.findOne({
            where: {
                uuid: userUUID,
                userType: UserType.STUDENT
            },
            relations: {
                student: {
                    guardian: true,
                    emergencyContact: true
                }
            }
        });

        // Check if student exists
        if (!existingStudent) {
            return {
                statusCode: 404,
                message: 'student.studentNotFound'
            };
        }

        await userRepository.remove(existingStudent);

        if (existingStudent.student) {
            await studentRepository.remove(existingStudent.student);
        }

        await queryRunner.commitTransaction();

        return {
            statusCode: 200,
            message: 'student.studentDeleted'
        };
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(error instanceof Error
            ? error.message
            : 'student.studentDeletionFailed'
        );
    } finally {
        // Always release the query runner
        await queryRunner.release();
    }
};
