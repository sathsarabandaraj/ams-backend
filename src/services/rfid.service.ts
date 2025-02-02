import { AppDataSource } from "../configs/db.config";
import { Rfid } from "../entities/rfid.entity";
import { IApiResult, IPaginatedApiResult } from "../types";

export const getAllRdifs = async (
    pageNumber: number,
    pageSize: number,
    order?: string,
    onlyFloating?: boolean
): Promise<IPaginatedApiResult<Rfid>> => {
    const rfidRepository = AppDataSource.getRepository(Rfid);
    try {
        const queryOptions: any = {
            order: {
                created_at: (order as 'ASC' | 'DESC') ?? 'DESC'
            },
            take: pageSize,
            skip: pageNumber * pageSize,
            relations: ['user'],
        };

        if (onlyFloating) {
            queryOptions.where = {
                user: null,
            };
        }

        const [rfids, total] = await rfidRepository.findAndCount(queryOptions);

        if (rfids.length === 0) {
            return {
                statusCode: 404,
                message: 'rfid.rfidNotFound',
                pageNumber,
                pageSize,
                totalItemCount: 0,
                items: []
            };
        }

        return {
            statusCode: 200,
            message: 'rfid.rfidRetrieved',
            pageNumber,
            pageSize,
            totalItemCount: total,
            items: rfids
        };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : 'rfid.rfidRetrievalFailed'
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

export const getRfidByTag = async(
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
