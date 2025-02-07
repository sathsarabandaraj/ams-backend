import {
    isModuleRegisteredHandler,
    registerAccessModuleHandler,
    registerRfidTagHandler,
    getAllAccessModulesHandler
} from "../controllers/hardware.controller";
import { Router } from "express";

const router = Router()

router.get('/registration-check/:macAddress', isModuleRegisteredHandler)
router.post('/register-access-module', registerAccessModuleHandler)
router.post('/register-rfid', registerRfidTagHandler)
router.get('/access-modules', getAllAccessModulesHandler)

export default router
