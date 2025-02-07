import { type Request, type Response } from 'express'
import { isModuleRegistered, registerAccessModule, registerRfidTag, getAllAccessModules } from '../services/hardware.service'

export const registerAccessModuleHandler = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { accessModule } = req.body

        const feedback = await registerAccessModule(accessModule)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message ?? 'default.message'),
            data: feedback.data
        })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: req.t(error.message),
                message: req.t('server.internalServerErr')
            })
        }

        throw error
    }
}

export const isModuleRegisteredHandler = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { macAddress } = req.params;

    if (!macAddress) {
        return res.status(400).json({
            message: req.t('module.macAddressMissing'),
        });
    }

    const isRegistered = await isModuleRegistered(macAddress);

    return res.status(200).json({
        isRegistered,
    });
};

export const registerRfidTagHandler = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        // Extract RFID data from the request body
        const { rfid } = req.body;

        // Call the service function to register the RFID tag
        const feedback = await registerRfidTag(rfid);

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message ?? 'default.message'),
            data: feedback.data,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: req.t(error.message),
                message: req.t('server.internalServerErr'),
            });
        }

        throw error;
    }
};

export const getAllAccessModulesHandler = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const pageNumber = parseInt(req.query.pageNumber as string) || 0
        const pageSize = parseInt(req.query.pageSize as string) || 10
        const onlyActive = req.query.onlyActive === 'true'

        const feedback = await getAllAccessModules(pageNumber, pageSize, onlyActive)

        return res.status(feedback.statusCode).json({
            message: req.t(feedback.message ?? 'default.message'),
            data: {
                pageNumber: feedback.pageNumber,
                pageSize: feedback.pageSize,
                totalItemCount: feedback.totalItemCount,
                items: feedback.items
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({
                error: req.t(error.message),
                message: req.t('server.internalServerErr')
            })
        }
        throw error
    }
}