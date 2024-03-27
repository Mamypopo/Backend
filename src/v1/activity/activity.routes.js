import { Router } from 'express';
import * as ActivityController from './activity.controller.js';
import validateToken, { validateRole } from '../auth/auth.middleware.js';

const router = Router();

router.get('/getAllActivity', ActivityController.getAllActivityHanlder);

router.post('/getActivityById', ActivityController.getActivityByIdHandler);

router.get('/getByUserId', validateToken, validateRole(['teacher', 'admin']), ActivityController.getActivityByUserIdHandler);

router.get('/getStudentActivity', validateToken, ActivityController.getStudentActivityHandler);

router.get('/getStudentActivityDoc', validateToken, ActivityController.getStudentActivityDoc);

router.get('/getStudentActivityHistory', validateToken, ActivityController.getStudentActivityHistory);

router.get('/getAcitivityCount', ActivityController.getActivityCount);

router.post('/addActivity', validateToken, validateRole(['teacher', 'admin']), ActivityController.addActivityHandler);

router.post('/addComment', validateToken, ActivityController.addCommentHandler);

router.post('/addPaticipant', validateToken, ActivityController.addPaticipantHandler);

router.post('/updateParticipantStatus', validateToken, validateRole(['teacher', 'admin']), ActivityController.updateParticipantStatusHandler);

router.post('/updateActivity', validateToken, validateRole(['teacher', 'admin']), ActivityController.updateActivityHandler);

router.post('/deleteActivity', validateToken, validateRole(['teacher', 'admin']), ActivityController.deleteActivityHandler);

router.post('/deleteComment', validateToken, ActivityController.deleteCommentHandler);

export default router;
