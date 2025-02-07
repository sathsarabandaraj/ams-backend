import { AppDataSource } from '../configs/db.config'
import { User } from '../entities/user.entity'
import { Attendance } from '../entities/attendance.entity'
import { Rfid } from '../entities/rfid.entity'
import { UserType } from '../enums'
import { startOfDay, endOfDay } from 'date-fns'
import { Between } from 'typeorm'
import { IApiResult } from '../types'

interface DashboardStats {
    totalStudents: number
    totalStaff: number
    totalRfids: number
    todayAttendance: number
    avgCheckInTime: string | null
}

export const getDashboardStats = async (): Promise<IApiResult<DashboardStats>> => {
    try {
        const userRepository = AppDataSource.getRepository(User)
        const rfidRepository = AppDataSource.getRepository(Rfid)
        const attendanceRepository = AppDataSource.getRepository(Attendance)

        // Get total students
        const totalStudents = await userRepository.count({
            where: { userType: UserType.STUDENT }
        })

        // Get total staff
        const totalStaff = await userRepository.count({
            where: { userType: UserType.STAFF }
        })

        // Get total RFIDs
        const totalRfids = await rfidRepository.count()

        // Get today's attendance
        const today = new Date()
        const todayAttendance = await attendanceRepository.count({
            where: {
                created_at: Between(startOfDay(today), endOfDay(today))
            }
        })

        // Calculate average check-in time
        const avgCheckInTimeResult = await attendanceRepository
            .createQueryBuilder('attendance')
            .select("TO_CHAR(AVG(attendance.created_at::time), 'HH24:MI')", 'avgTime')
            .where('attendance.created_at >= :startDate', { startDate: startOfDay(today) })
            .andWhere('attendance.created_at <= :endDate', { endDate: endOfDay(today) })
            .getRawOne()

        return {
            statusCode: 200,
            message: 'dashboard.statsRetrieved',
            data: {
                totalStudents,
                totalStaff,
                totalRfids,
                todayAttendance,
                avgCheckInTime: avgCheckInTimeResult?.avgTime || null
            }
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        throw new Error(
            error instanceof Error
                ? `dashboard.statsRetrievalFailed: ${error.message}`
                : 'dashboard.statsRetrievalFailed'
        )
    }
} 