import { AppDataSource } from "../configs/db.config";
import { Rfid } from "../entities/rfid.entity";
import { IApiResult, IPaginatedApiResult } from "../types";
import { User } from "../entities/user.entity";
import { IsNull } from "typeorm";

export const getAllRfids = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    order: string = 'ASC',
    onlyFloating: boolean = false,
): Promise<IPaginatedApiResult<Rfid>> => {
    const rfidRepository = AppDataSource.getRepository(Rfid);
    try {
        const whereCondition = onlyFloating ? { user: IsNull() } : {};

        const [items, totalItemCount] = await rfidRepository.findAndCount({
            where: whereCondition,
            order: { created_at: order.toUpperCase() as 'ASC' | 'DESC' },
            skip: pageNumber * pageSize,
            take: pageSize,
            relations: {
                user: true
            }
        });

        if (items.length === 0) {
            return {
                statusCode: 404,
                message: 'rfid.noRfidsFound',
                pageNumber,
                pageSize,
                totalItemCount: 0,
                items: []
            };
        }

        return {
            statusCode: 200,
            message: 'rfid.rfidsRetrieved',
            pageNumber,
            pageSize,
            totalItemCount,
            items
        };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'rfid.retrievalFailed'
        );
    }
};


export const getRfidByUuid = async (
    rfidUuid: string
): Promise<IApiResult<Rfid>> => {
    const rfidRepository = AppDataSource.getRepository(Rfid)
    try {
        const rfid = await rfidRepository.findOne({
            where: {
                uuid: rfidUuid,
            },
            relations: {
                user: true
            }
        })

        if (!rfid) {
            return {
                statusCode: 404,
                message: 'rfid.rfidNotFound',
            }
        }

        return {
            statusCode: 200,
            message: 'rfid.rfidRetrieved',
            data: rfid
        }
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'rfid.rfidRetrievalFailed'
        )
    }
}

export const getRfidByTag = async (
    rfidTag: string
): Promise<IApiResult<Rfid>> => {
    const rfidRepository = AppDataSource.getRepository(Rfid);
    try {
        const rfid = await rfidRepository.findOne({
            where: {
                rfidTag: rfidTag,
            },
            relations: ['user'],
        });

        if (!rfid) {
            return {
                statusCode: 404,
                message: 'rfid.rfidNotFound',
            };
        }

        return {
            statusCode: 200,
            message: 'rfid.rfidRetrieved',
            data: rfid,
        };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'rfid.rfidRetrievalFailed'
        );
    }
}

export const assignRfidToUser = async (
    rfidUuid: string,
    userUuid: string
): Promise<IApiResult<Rfid>> => {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
        const rfidRepository = AppDataSource.getRepository(Rfid)
        const userRepository = AppDataSource.getRepository(User)

        const rfid = await rfidRepository.findOne({
            where: { uuid: rfidUuid },
            relations: ['user']
        })

        if (!rfid) {
            return {
                statusCode: 404,
                message: 'rfid.rfidNotFound'
            }
        }

        if (rfid.user) {
            return {
                statusCode: 400,
                message: 'rfid.alreadyAssigned'
            }
        }

        const user = await userRepository.findOne({
            where: { uuid: userUuid }
        })

        if (!user) {
            return {
                statusCode: 404,
                message: 'user.userNotFound'
            }
        }

        rfid.user = user
        const savedRfid = await rfidRepository.save(rfid)

        await queryRunner.commitTransaction()

        return {
            statusCode: 200,
            message: 'rfid.assignedSuccessfully',
            data: savedRfid
        }
    } catch (error) {
        await queryRunner.rollbackTransaction()
        throw new Error(
            error instanceof Error ? error.message : 'rfid.assignmentFailed'
        )
    } finally {
        await queryRunner.release()
    }
}

export const removeRfidFromUser = async (
    rfidUuid: string
): Promise<IApiResult<Rfid>> => {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
        const rfidRepository = queryRunner.manager.getRepository(Rfid)

        const rfid = await rfidRepository.findOne({
            where: { uuid: rfidUuid },
            relations: ['user']
        })

        if (!rfid) {
            await queryRunner.rollbackTransaction()
            return {
                statusCode: 404,
                message: 'rfid.rfidNotFound'
            }
        }

        await queryRunner.manager
            .createQueryBuilder()
            .update(Rfid)
            .set({ user: null })
            .where("uuid = :uuid", { uuid: rfidUuid })
            .execute();

        await queryRunner.commitTransaction();

        return {
            statusCode: 200,
            message: 'rfid.userRemovedSuccessfully'
        }
    } catch (error) {
        await queryRunner.rollbackTransaction()
        throw new Error(
            error instanceof Error ? error.message : 'rfid.userRemoveFailed'
        )
    } finally {
        await queryRunner.release();
    }
}

export const getUserRfids = async (
    userUuid: string
): Promise<IApiResult<Rfid[]>> => {
    const rfidRepository = AppDataSource.getRepository(Rfid)
    try {
        const rfids = await rfidRepository.find({
            where: {
                user: { uuid: userUuid }
            }
        })

        if (rfids.length === 0) {
            return {
                statusCode: 404,
                message: 'rfid.noRfidsFound'
            }
        }

        return {
            statusCode: 200,
            message: 'rfid.rfidsRetrieved',
            data: rfids
        }
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'rfid.retrievalFailed'
        )
    }
}

export const deleteRfid = async (
    rfidUuid: string
): Promise<IApiResult<void>> => {
    const queryRunner = AppDataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
        const rfidRepository = AppDataSource.getRepository(Rfid)

        const rfid = await rfidRepository.findOne({
            where: { uuid: rfidUuid }
        })

        if (!rfid) {
            return {
                statusCode: 404,
                message: 'rfid.rfidNotFound'
            }
        }

        await rfidRepository.remove(rfid)

        await queryRunner.commitTransaction()

        return {
            statusCode: 200,
            message: 'rfid.deletedSuccessfully'
        }
    } catch (error) {
        await queryRunner.rollbackTransaction()
        throw new Error(
            error instanceof Error ? error.message : 'rfid.deletionFailed'
        )
    } finally {
        await queryRunner.release()
    }
}
