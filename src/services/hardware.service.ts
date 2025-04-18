import { AppDataSource } from '../configs/db.config';
import { Rfid } from '../entities/rfid.entity';
import { User } from '../entities/user.entity';
import { IApiResult, IPaginatedApiResult } from '../types';
import { AccessModule } from '../entities/access-module.entity';

export const registerAccessModule = async (
    moduleData: Partial<AccessModule>
): Promise<IApiResult<AccessModule>> => {
    const moduleRepository = AppDataSource.getRepository(AccessModule);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const newAccessModule = moduleRepository.create({
            ...moduleData,
            isActive: false,
        });

        const savedAccessModule = await moduleRepository.save(newAccessModule);
        await queryRunner.commitTransaction();

        return {
            statusCode: 201,
            message: 'module.moduleCreated',
            data: savedAccessModule,
        };
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(
            error instanceof Error ? error.message : 'module.moduleCreationFailed'
        );
    } finally {
        await queryRunner.release();
    }
};

export const isModuleRegistered = async (macAddress: string): Promise<boolean> => {
    const moduleRepository = AppDataSource.getRepository(AccessModule);

    const module = await moduleRepository.findOne({
        where: { macAddress },
    });

    return !!module;
};

export const registerRfidTag = async (
    rfidData: Rfid
): Promise<IApiResult<Rfid>> => {
    const rfidRepository = AppDataSource.getRepository(Rfid);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // Check if RFID tag already exists
        const existingRfid = await rfidRepository.findOne({
            where: { rfidTag: rfidData.rfidTag },
        });

        if (!existingRfid) {
            const newRfid = rfidRepository.create({
                rfidTag: rfidData.rfidTag,
                isSystem: false,
                metadata: rfidData.metadata || {},
            });
            const savedRfid = await rfidRepository.save(newRfid);
            await queryRunner.commitTransaction();
            return {
                statusCode: 201,
                message: 'rfidTag.registeredSuccessfully',
                data: savedRfid,
            };
        } else {
            throw new Error('rfidTag.alreadyExists');
        }

        // Create the new RFID tag
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(
            error instanceof Error ? error.message : 'rfidTag.registrationFailed'
        );
    } finally {
        await queryRunner.release();
    }
};

// Update service to assign user to a floating RFID tag later
export const assignUserToRfidTag = async (
    rfidTag: string,
    userId: string
): Promise<IApiResult<Rfid>> => {
    const rfidRepository = AppDataSource.getRepository(Rfid);
    const userRepository = AppDataSource.getRepository(User);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // Find the RFID tag by tag
        const rfid = await rfidRepository.findOne({
            where: { rfidTag },
            relations: ['user'], // Make sure to load the user relationship
        });

        if (!rfid) {
            throw new Error('rfidTag.notFound');
        }

        // Check if the user exists
        const user = await userRepository.findOne({ where: { uuid: userId } });
        if (!user) {
            throw new Error('user.notFound');
        }

        // Assign the user to the RFID tag
        rfid.user = user;
        const updatedRfid = await rfidRepository.save(rfid);

        // Commit transaction
        await queryRunner.commitTransaction();

        return {
            statusCode: 200,
            message: 'userAssignedToRfidTagSuccessfully',
            data: updatedRfid,
        };
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new Error(
            error instanceof Error ? error.message : 'rfidTag.assignmentFailed'
        );
    } finally {
        await queryRunner.release();
    }
};

export const getAllAccessModules = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    onlyActive: boolean = false
): Promise<IPaginatedApiResult<AccessModule>> => {
    const moduleRepository = AppDataSource.getRepository(AccessModule)

    try {
        const whereCondition: any = {}
        if (onlyActive) {
            whereCondition.isActive = true
        }

        const [items, totalItemCount] = await moduleRepository.findAndCount({
            where: whereCondition,
            order: {
                created_at: 'DESC'
            },
            skip: pageNumber * pageSize,
            take: pageSize
        })

        if (items.length === 0) {
            return {
                statusCode: 404,
                message: 'module.noModulesFound',
                pageNumber,
                pageSize,
                totalItemCount: 0,
                items: []
            }
        }

        return {
            statusCode: 200,
            message: 'module.modulesRetrieved',
            pageNumber,
            pageSize,
            totalItemCount,
            items
        }
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'module.retrievalFailed'
        )
    }
}
