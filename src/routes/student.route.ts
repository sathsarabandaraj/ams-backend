import { Router } from 'express'
import { createStudentHandler, getAllStudentsHandler } from '../controllers/student.controller'
import { requestBodyValidator, requestQueryValidator } from '../middlewares/request-validator.middleware'
import { StudentSchema } from '../schemas/student.schema'
import { PaginationSchema } from '../schemas/common/pagination.schema'

const router = Router()

router.post('/student', requestBodyValidator(StudentSchema), createStudentHandler)
router.get('/students', requestQueryValidator(PaginationSchema), getAllStudentsHandler)

export default router
