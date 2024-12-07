import { Router } from 'express'
import {
    createStudentHandler,
    deleteStudentController,
    getAllStudentsHandler,
    getStudentByUUIDHandler,
    updateStudentController
} from '../controllers/student.controller'
import { requestBodyValidator, requestQueryValidator } from '../middlewares/request-validator.middleware'
import { PaginationSchema } from '../schemas/common/pagination.schema'
import { StudentSchema, UpdateStudentSchema } from '../schemas/student.schema'

const router = Router()

router.post('/',requestBodyValidator(StudentSchema), createStudentHandler)
router.get('/', requestQueryValidator(PaginationSchema), getAllStudentsHandler)
router.get('/:uuid', getStudentByUUIDHandler)
router.put('/:uuid', requestBodyValidator(UpdateStudentSchema), updateStudentController)
router.delete('/:uuid', deleteStudentController)

export default router
