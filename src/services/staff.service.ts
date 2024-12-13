import { User } from '../entities/user.entity'
import { hash } from 'bcrypt'
import { AppDataSource } from '../configs/db.config'
import { type IApiResult, type IPaginatedApiResult } from '../types'
import { AccoutStatus, UserType } from '../enums'
import { Staff } from '../entities/staff.entity'

export const createStaff = async (
  userData: User
): Promise<IApiResult<User>> => {
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
      userType: UserType.STAFF,
      accountStatus: AccoutStatus.ACTIVE
    })

    const savedUser = await userRepository.save(newUser)

    await queryRunner.commitTransaction()

    return {
      statusCode: 201,
      message: 'staff.staffCreated',
      data: savedUser
    }
  } catch (error) {
    await queryRunner.rollbackTransaction()
    throw new Error(
      error instanceof Error ? error.message : 'staff.staffCreationFailed'
    )
  } finally {
    await queryRunner.release()
  }
}

export const getAllStaff = async (
  pageNumber: number,
  pageSize: number,
  order?: string
): Promise<IPaginatedApiResult<User>> => {
  // get all users that are staff
  const userRepository = AppDataSource.getRepository(User)
  try {
    const [staff, total] = await userRepository.findAndCount({
      where: {
        userType: UserType.STAFF
      },
      order: {
        created_at: (order as 'ASC' | 'DESC') ?? 'DESC'
      },
      take: pageSize,
      skip: pageNumber * pageSize,
      relations: {
        staff: true
      }
    })

    if (staff.length === 0) {
      return {
        statusCode: 404,
        message: 'staff.staffNotFound',
        pageNumber,
        pageSize,
        totalItemCount: 0,
        items: []
      }
    }

    return {
      statusCode: 200,
      message: 'staff.staffRetrieved',
      pageNumber,
      pageSize,
      totalItemCount: total,
      items: staff
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'staff.staffRetrievalFailed'
    )
  }
}

export const getStaffByUUID = async (
  userUUID: string
): Promise<IApiResult<User>> => {
  const userRepository = AppDataSource.getRepository(User)
  try {
    const staff = await userRepository.findOne({
      where: {
        uuid: userUUID,
        userType: UserType.STAFF
      },
      relations: {
        staff: true
      }
    })

    if (!staff) {
      return {
        statusCode: 404,
        message: 'staff.staffNotFound'
      }
    }

    return {
      statusCode: 200,
      message: 'staff.staffRetrieved',
      data: staff
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'staff.staffRetrievalFailed'
    )
  }
}

export const updateStaff = async (
  userUUID: string,
  updateData: Partial<User>
): Promise<IApiResult<User>> => {
  const queryRunner = AppDataSource.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    const userRepository = AppDataSource.getRepository(User)

    // Find the existing staff with specified relations
    const existingStaff = await userRepository.findOne({
      where: {
        uuid: userUUID,
        userType: UserType.STAFF
      },
      relations: {
        staff: {
          bankDetails: true,
          secondaryContact: true
        }
      }
    })

    // Check if staff exists
    if (!existingStaff) {
      return {
        statusCode: 404,
        message: 'staff.staffNotFound'
      }
    }

    // Prepare update object with deep merge
    const updatedStaffData = {
      ...existingStaff,
      ...updateData,
      // Carefully merge staff-specific data
      staff: {
        ...existingStaff.staff,
        ...(updateData.staff ?? {}),
        // Handle secondaryContact updates
        secondaryContact: updateData.staff?.secondaryContact
          ? {
              ...existingStaff.staff?.secondaryContact,
              ...(updateData.staff.secondaryContact ?? {})
            }
          : existingStaff.staff?.secondaryContact,
        // Handle emergency contact updates
        bankDetails: updateData.staff?.bankDetails
          ? {
              ...existingStaff.staff?.bankDetails,
              ...(updateData.staff.bankDetails ?? {})
            }
          : existingStaff.staff?.bankDetails
      }
    }

    // Perform the update
    const updatedStaff = await userRepository.save(updatedStaffData)

    await queryRunner.commitTransaction()

    return {
      statusCode: 200,
      message: 'staff.staffUpdated',
      data: updatedStaff
    }
  } catch (error) {
    await queryRunner.rollbackTransaction()
    throw new Error(
      error instanceof Error ? error.message : 'staff.staffUpdateFailed'
    )
  } finally {
    // Always release the query runner
    await queryRunner.release()
  }
}

export const deleteStaff = async (
  userUUID: string
): Promise<IApiResult<User>> => {
  const queryRunner = AppDataSource.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()

  try {
    const userRepository = AppDataSource.getRepository(User)
    const staffRepository = AppDataSource.getRepository(Staff)

    // Find the existing staff with specified relations
    const existingStaff = await userRepository.findOne({
      where: {
        uuid: userUUID,
        userType: UserType.STAFF
      },
      relations: {
        staff: {
          bankDetails: true,
          secondaryContact: true
        }
      }
    })

    // Check if staff exists
    if (!existingStaff) {
      return {
        statusCode: 404,
        message: 'staff.staffNotFound'
      }
    }

    await userRepository.remove(existingStaff)

    if (existingStaff.staff) {
      await staffRepository.remove(existingStaff.staff)
    }

    await queryRunner.commitTransaction()

    return {
      statusCode: 200,
      message: 'staff.staffDeleted'
    }
  } catch (error) {
    await queryRunner.rollbackTransaction()
    throw new Error(
      error instanceof Error ? error.message : 'staff.staffDeletionFailed'
    )
  } finally {
    // Always release the query runner
    await queryRunner.release()
  }
}
