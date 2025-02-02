import {Router} from 'express'
import { getAllRdifsHandler, getRfidByTagHandler, getRfidByUUIDHandler } from '../controllers/rfid.controller'

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

export default router
