import { Router } from 'express'
import { createStudentHandler } from '../controllers/student.controller'
import { requestBodyValidator } from '../middlewares/request-validator.middleware'
import { StudentSchema } from '../schemas/student.schema'

const router = Router()

router.post('/student', requestBodyValidator(StudentSchema), createStudentHandler)

export default router