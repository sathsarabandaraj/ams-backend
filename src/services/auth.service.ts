import { compare, hash } from 'bcrypt'
import { AppDataSource } from '../configs/db.config'
import { User } from '../entities/user.entity'
import { type IApiResult } from '../types'
import { AccoutStatus, Roles, UserType } from '../enums'
import { generateOTP } from '../utils/auth.util'
import redisClient from '../configs/redis.config'
import { JWT_EXPIRY, JWT_SECRET, OTP_EXPIRY } from '../configs/env.config'
import jwt from 'jsonwebtoken'
import { sendOtpEmail, sendPasswordResetEmail } from '../utils/email.util'

export const loginOTP = async (
    systemId: string,
    password: string
): Promise<IApiResult<unknown>> => {
    const userRepository = AppDataSource.getRepository(User)
    try {
        const user = await userRepository.findOne({
            where: {
                systemId
            },
            select: {
                password: true,
                accountStatus: true,
                firstName: true,
                email: true
            }
        })

        if (!user) {
            return {
                statusCode: 404,
                message: 'auth.userNotFound'
            }
        }

        const isPasswordValid = await compare(password, user.password)
        if (!isPasswordValid) {
            return {
                statusCode: 401,
                message: 'auth.invalidCredentials'
            }
        }

        if (
            user.accountStatus === AccoutStatus.INACTIVE ||
            user.accountStatus === AccoutStatus.BANNED ||
            user.accountStatus === AccoutStatus.PENDING
        ) {
            return {
                statusCode: 403,
                message: 'auth.accountInactive'
            }
        }

        const otp = generateOTP()
        await redisClient.setEx(`otp:${systemId}`, OTP_EXPIRY, otp)
        const sendEmailResponse = await sendOtpEmail(
            user.firstName,
            user.email,
            otp
        )
        if (sendEmailResponse.$metadata.httpStatusCode === 200) {
            return {
                statusCode: 200,
                message: 'auth.otpSent'
            }
        } else {
            return {
                statusCode: sendEmailResponse.$metadata.httpStatusCode ?? 500,
                message: 'auth.otpFailed'
            }
        }
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'auth.otpSendFailed'
        )
    }
}

export const verifyOTP = async (
    systemId: string,
    otp: string
): Promise<IApiResult<unknown>> => {
    try {
        const storedOtp = await redisClient.get(`otp:${systemId}`)
        if (!storedOtp || storedOtp !== otp) {
            return {
                statusCode: 401,
                message: 'auth.invalidOTP'
            }
        }

        const userRepository = AppDataSource.getRepository(User)

        const user = await userRepository.findOne({
            where: { systemId },
            relations: {
                staff: true
            }
        })

        if (!user) {
            return {
                statusCode: 404,
                message: 'auth.userNotFound'
            }
        }

        const token = jwt.sign(
            {
                systemId: user.systemId,
                userType: user.userType,
                accountStatus: user.accountStatus,
                email: user.email,
                role:
                    user.userType === UserType.STAFF
                        ? user.staff?.isAdmin
                            ? Roles.STAFF_ADMIN
                            : Roles.STAFF_NONADMIN
                        : Roles.STUDENT
            },
            JWT_SECRET,
            {
                expiresIn: JWT_EXPIRY
            }
        )

        await redisClient.del(`otp:${systemId}`)

        return {
            statusCode: 200,
            message: 'auth.otpVerified',
            data: token
        }
    } catch
    (error) {
        throw new Error(
            error instanceof Error ? error.message : 'auth.otpVerificationFailed'
        )
    }
}

export const getMe = async (
    systemId: string
): Promise<IApiResult<Partial<User>>> => {
    try {
        const userRepository = AppDataSource.getRepository(User)

        const user = await userRepository.findOne({
            where: { systemId },
            relations: {
                staff: true,
                student: true,
                mainCenter: true
            }
        })

        if (!user) {
            return {
                statusCode: 404,
                message: 'auth.userNotFound'
            }
        }

        return {
            statusCode: 200,
            message: 'auth.userDataRetrieved',
            data: user
        }
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'auth.userDataRetrievalFailed'
        )
    }
}

export const forgotPassword = async (
    systemId: string
): Promise<IApiResult<unknown>> => {
    try {
        const userRepository = AppDataSource.getRepository(User)

        const user = await userRepository.findOne({
            where: { systemId }
        })

        if (!user) {
            return {
                statusCode: 404,
                message: 'auth.userNotFound'
            }
        }

        const otp = generateOTP()
        await redisClient.setEx(`forgot:${systemId}`, OTP_EXPIRY, otp)
        const sendEmailResponse = await sendPasswordResetEmail(
            user.firstName,
            user.email,
            otp
        )
        if (sendEmailResponse.$metadata.httpStatusCode === 200) {
            return {
                statusCode: 200,
                message: 'auth.otpSent'
            }
        } else {
            return {
                statusCode: sendEmailResponse.$metadata.httpStatusCode ?? 500,
                message: 'auth.otpFailed'
            }
        }

    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'auth.otpSendFailed'
        )
    }
}

export const resetPassword = async (
    systemId: string,
    otp: string,
    newPassword: string
): Promise<IApiResult<unknown>> => {
    try {
        const storedOtp = await redisClient.get(`forgot:${systemId}`)
        if (!storedOtp || storedOtp !== otp) {
            return {
                statusCode: 401,
                message: 'auth.invalidOTP'
            }
        }

        const userRepository = AppDataSource.getRepository(User)

        const user = await userRepository.findOne({
            where: { systemId }
        })

        if (!user) {
            return {
                statusCode: 404,
                message: 'auth.userNotFound'
            }
        }

        user.password = await hash(newPassword, 10)

        await userRepository.save(user)
        await redisClient.del(`forgot:${systemId}`)

        return {
            statusCode: 200,
            message: 'auth.passwordResetSuccess'
        }
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'auth.passwordResetFailed'
        )
    }
}
