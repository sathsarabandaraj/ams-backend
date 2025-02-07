import { Router } from 'express'
import { getDashboardStatsController } from '../controllers/dashboard.controller'
import { authorize } from '../middlewares/auth.middleware'
import passport from 'passport'
import { Roles } from '../enums'

const router = Router()

router.get('/stats', passport.authenticate('jwt', { session: false }),
    authorize([Roles.STAFF_ADMIN, Roles.STAFF_NONADMIN]), getDashboardStatsController)

export default router 