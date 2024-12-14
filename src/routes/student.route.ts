import { Router } from 'express'
import {
  createStudentHandler,
  deleteStudentController,
  getAllStudentsHandler,
  getStudentByUUIDHandler,
  updateStudentController
} from '../controllers/student.controller'
import {
  requestBodyValidator,
  requestQueryValidator
} from '../middlewares/request-validator.middleware'
import { PaginationSchema } from '../schemas/common/pagination.schema'
import { StudentSchema, UpdateStudentSchema } from '../schemas/student.schema'
import passport from 'passport'
import { Roles } from '../enums'
import { authorize } from '../middlewares/auth.middleware'

const router = Router()

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN, Roles.STAFF_NONADMIN]),
  requestBodyValidator(StudentSchema),
  createStudentHandler
)

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN, Roles.STAFF_NONADMIN]),
  requestQueryValidator(PaginationSchema),
  getAllStudentsHandler
)

router.get(
  '/:uuid',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN, Roles.STAFF_NONADMIN], true),
  getStudentByUUIDHandler
)

router.put(
  '/:uuid',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN, Roles.STAFF_NONADMIN], true),
  requestBodyValidator(UpdateStudentSchema),
  updateStudentController
)

router.delete(
  '/:uuid',
  passport.authenticate('jwt', { session: false }),
  authorize([Roles.STAFF_ADMIN], true),
  deleteStudentController
)

export default router
