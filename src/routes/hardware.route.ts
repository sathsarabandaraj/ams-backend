import {
    isModuleRegisteredHandler,
    registerAccessModuleHandler,
    registerRfidTagHandler
} from "../controllers/hardware.controller";
import {Router} from "express";

const router = Router()

router.get('/registration-check/:macAddress', isModuleRegisteredHandler)
router.post('/register-access-module', registerAccessModuleHandler)
router.post('/register-rfid', registerRfidTagHandler)

export default router
