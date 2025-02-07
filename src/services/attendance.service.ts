import { AppDataSource } from "../configs/db.config"
import { Attendance } from "../entities/attendance.entity"
import { IApiResult, IPaginatedApiResult } from "../types"
import { Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm"
import { AttendanceInOutStatus } from "../enums"
import { User } from "../entities/user.entity"
import { Rfid } from "../entities/rfid.entity"
import { AccessModule } from "../entities/access-module.entity"

export const getAllAttendance = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    startDate?: Date,
    endDate?: Date
): Promise<IPaginatedApiResult<Attendance>> => {
    const attendanceRepository = AppDataSource.getRepository(Attendance)

    try {
        const whereCondition: any = {}

        if (startDate && endDate) {
            whereCondition.created_at = Between(startDate, endDate)
        } else if (startDate) {
            whereCondition.created_at = MoreThanOrEqual(startDate)
        } else if (endDate) {
            whereCondition.created_at = LessThanOrEqual(endDate)
        }

        const [items, totalItemCount] = await attendanceRepository.findAndCount({
            where: whereCondition,
            relations: {
                user: true,
                rfid: true,
                accessModule: true
            },
            order: {
                created_at: 'DESC'
            },
            skip: pageNumber * pageSize,
            take: pageSize
        })

        if (items.length === 0) {
            return {
                statusCode: 404,
                message: 'attendance.noRecordsFound',
                pageNumber,
                pageSize,
                totalItemCount: 0,
                items: []
            }
        }

        return {
            statusCode: 200,
            message: 'attendance.recordsRetrieved',
            pageNumber,
            pageSize,
            totalItemCount,
            items
        }
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'attendance.retrievalFailed'
        )
    }
}

export const getUserAttendance = async (
    userUuid: string,
    startDate?: Date,
    endDate?: Date
): Promise<IApiResult<Attendance[]>> => {
    const attendanceRepository = AppDataSource.getRepository(Attendance)

    try {
        const whereCondition: any = {
            user: { uuid: userUuid }
        }

        if (startDate && endDate) {
            whereCondition.created_at = Between(startDate, endDate)
        } else if (startDate) {
            whereCondition.created_at = MoreThanOrEqual(startDate)
        } else if (endDate) {
            whereCondition.created_at = LessThanOrEqual(endDate)
        } else {
            // If no dates specified, get current day's records
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            whereCondition.created_at = Between(today, tomorrow)
        }

        const attendance = await attendanceRepository.find({
            where: whereCondition,
            relations: {
                user: true,
                rfid: true,
                accessModule: true
            },
            order: {
                created_at: 'DESC'
            }
        })

        if (attendance.length === 0) {
            return {
                statusCode: 404,
                message: 'attendance.noRecordsFound'
            }
        }

        return {
            statusCode: 200,
            message: 'attendance.recordsRetrieved',
            data: attendance
        }
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'attendance.retrievalFailed'
        )
    }
}

export const markAttendance = async (
    userUuid: string,
    inOutStatus: AttendanceInOutStatus,
    rfidUuid?: string,
    accessModuleUuid?: string
): Promise<IApiResult<Attendance>> => {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
        const userRepository = queryRunner.manager.getRepository(User)
        const attendanceRepository = queryRunner.manager.getRepository(Attendance)
        const rfidRepository = queryRunner.manager.getRepository(Rfid)
        const accessModuleRepository = queryRunner.manager.getRepository(AccessModule)

        const user = await userRepository.findOne({ where: { uuid: userUuid } })

        if (!user) {
            await queryRunner.rollbackTransaction()
            return {
                statusCode: 404,
                message: 'user.userNotFound'
            }
        }

        const attendance = new Attendance()
        attendance.user = user
        attendance.inOutStatus = inOutStatus

        if (rfidUuid) {
            const rfid = await rfidRepository.findOne({ where: { uuid: rfidUuid } })
            if (rfid) {
                attendance.rfid = rfid
            }
        }

        if (accessModuleUuid) {
            const accessModule = await accessModuleRepository.findOne({ where: { uuid: accessModuleUuid } })
            if (accessModule) {
                attendance.accessModule = accessModule
            }
        }

        const saved = await attendanceRepository.save(attendance)
        await queryRunner.commitTransaction()

        return {
            statusCode: 200,
            message: 'attendance.marked',
            data: saved
        }

    } catch (error) {
        await queryRunner.rollbackTransaction()
        throw new Error(
            error instanceof Error ? error.message : 'attendance.markingFailed'
        )
    } finally {
        await queryRunner.release()
    }
} 