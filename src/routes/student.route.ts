import { Router } from 'express'
import { createStudentHandler, getAllStudentsHandler, getStudentByUUIDHandler } from '../controllers/student.controller'
import { requestBodyValidator, requestQueryValidator } from '../middlewares/request-validator.middleware'
import { StudentSchema } from '../schemas/student.schema'
import { PaginationSchema } from '../schemas/common/pagination.schema'

const router = Router()

router.post('/', requestBodyValidator(StudentSchema), createStudentHandler)
router.get('/', requestQueryValidator(PaginationSchema), getAllStudentsHandler)
router.get('/:uuid', getStudentByUUIDHandler)

export default router
