import { Router } from 'express';
import * as ActivityController from './activity.controller.js';
import validateToken, { validateRole } from '../auth/auth.middleware.js';

const router = Router();

router.get('/getAllActivity', ActivityController.getAllActivityHanlder);

router.post('/getActivityById', ActivityController.getActivityByIdHandler);

router.post('/addActivity', validateToken, validateRole(['teacher', 'admin']), ActivityController.addActivityHandler);

router.post('/updateActivity', validateToken, validateRole(['teacher', 'admin']), ActivityController.updateActivityHandler);

router.post('/deleteActivity', validateToken, validateRole(['teacher', 'admin']), ActivityController.deleteActivityHandler);

export default router;
