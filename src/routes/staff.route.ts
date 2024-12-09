import { Router } from 'express'
import {
    createStaffHandler,
    deleteStaffController,
    getAllStaffHandler,
    getStaffByUUIDHandler,
    updateStaffController,
} from '../controllers/staff.controller'
import { requestBodyValidator, requestQueryValidator} from '../middlewares/request-validator.middleware'
import { StaffSchema, UpdateStaffSchema } from '../schemas/staff.schema'
import { PaginationSchema } from '../schemas/common/pagination.schema'

const router = Router()

router.post('/', requestBodyValidator(StaffSchema), createStaffHandler)
router.get('/', requestQueryValidator(PaginationSchema), getAllStaffHandler)
router.get('/:uuid', getStaffByUUIDHandler)
router.put('/:uuid', requestBodyValidator(UpdateStaffSchema), updateStaffController)
router.delete('/:uuid', deleteStaffController)

export default router
