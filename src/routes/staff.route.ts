import {Router} from 'express'
import {
  createStaffHandler,
  deleteStaffController,
  getAllStaffHandler,
  getStaffByUUIDHandler,
  updateStaffController
} from '../controllers/staff.controller'
import {requestBodyValidator, requestQueryValidator} from '../middlewares/request-validator.middleware'
import {StaffSchema, UpdateStaffSchema} from '../schemas/staff.schema'
import {PaginationSchema} from '../schemas/common/pagination.schema'
import passport from 'passport'
import {Roles} from '../enums'
import {authorize} from '../middlewares/auth.middleware'

const router = Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN]),
  requestBodyValidator(StaffSchema),
  createStaffHandler
)

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN, Roles.STAFF_NONADMIN]),
  requestQueryValidator(PaginationSchema),
  getAllStaffHandler
)

router.get(
  '/:uuid',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN], true),
  getStaffByUUIDHandler
)

router.put(
  '/:uuid',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN], true),
  requestBodyValidator(UpdateStaffSchema),
  updateStaffController
)

router.delete(
  '/:uuid',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN]),
  deleteStaffController
)

export default router
