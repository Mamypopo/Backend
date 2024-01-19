import { Router } from 'express';
import * as ActivityController from './activity.controller.js';
import validateToken, { validateRole } from '../auth/auth.middleware.js';

const router = Router();

router.get('/getAllActivity', ActivityController.getAllActivityHanlder);

router.post('/getActivityById', ActivityController.getActivityByIdHandler);

router.post('/addActivity', validateToken, validateRole(['teacher', 'admin']), ActivityController.addActivityHandler);

router.post('/addComment', validateToken, ActivityController.addCommentHandler);

router.post('/updateActivity', validateToken, validateRole(['teacher', 'admin']), ActivityController.updateActivityHandler);

router.post('/deleteActivity', validateToken, validateRole(['teacher', 'admin']), ActivityController.deleteActivityHandler);

router.post('/deleteComment', validateToken, ActivityController.deleteCommentHandler)

export default router;
