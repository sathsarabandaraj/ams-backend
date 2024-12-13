import { compare } from 'bcrypt'
import { AppDataSource } from '../configs/db.config'
import { User } from '../entities/user.entity'
import { type IApiResult } from '../types'
import { AccoutStatus, Roles, UserType } from '../enums'
import { generateAndStoreOtp } from '../utils/auth.util'
import redisClient from '../configs/redis.config'
import { JWT_SECRET, JWT_EXPIRY } from '../configs/env.config'
import jwt from 'jsonwebtoken'

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
        password: true
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

    await generateAndStoreOtp(systemId)

    return {
      statusCode: 200,
      message: 'auth.otpSent'
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
      where: {
        systemId
      },
      select: {
        systemId: true,
        userType: true,
        accountStatus: true,
        email: true,
        staff: {
          isAdmin: true
        }
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
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'auth.otpVerificationFailed'
    )
  }
}
