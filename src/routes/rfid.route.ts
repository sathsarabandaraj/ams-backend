import { Router } from 'express'
import { getAllRdifsHandler, getRfidByTagHandler, getRfidByUUIDHandler, assignRfidToUserHandler, removeRfidFromUserHandler, getUserRfidsHandler, deleteRfidHandler } from '../controllers/rfid.controller'

const router = Router()

router.get(
    '/',
    getAllRdifsHandler
)

router.get(
    '/uuid/:uuid',
    getRfidByUUIDHandler
)

router.get(
    '/tag/:rfidTag',
    getRfidByTagHandler
)

router.post(
    '/:rfidUuid/assign/:userUuid',
    assignRfidToUserHandler
)

router.post(
    '/:rfidUuid/unassign',
    removeRfidFromUserHandler
)

router.get(
    '/user/:userUuid',
    getUserRfidsHandler
)

router.delete(
    '/:uuid',
    deleteRfidHandler
)

export default router
