import { Router } from 'express'
import {
    getAllAttendanceHandler,
    getUserAttendanceHandler,
    markAttendanceHandler
} from '../controllers/attendance.controller'
import { requestQueryValidator } from '../middlewares/request-validator.middleware'
import { PaginationSchema } from '../schemas/common/pagination.schema'
import passport from 'passport'
import { authorize } from '../middlewares/auth.middleware'
import { Roles } from '../enums'

const router = Router()

// Get all attendance records (paginated)
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize([Roles.STAFF_ADMIN, Roles.STAFF_NONADMIN]),
    requestQueryValidator(PaginationSchema),
    getAllAttendanceHandler
)

// Get user attendance records
router.get(
    '/user/:userUuid',
/*     passport.authenticate('jwt', { session: false }),
    authorize([Roles.STAFF_ADMIN, Roles.STAFF_NONADMIN, Roles.STUDENT], true), */
    getUserAttendanceHandler
)

// Mark attendance
router.post(
    '/mark',
/*     passport.authenticate('jwt', { session: false }),
    authorize([Roles.STAFF_ADMIN, Roles.STAFF_NONADMIN]), */
    markAttendanceHandler
)

export default router 