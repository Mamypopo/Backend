import { Router } from 'express';
import validateToken, { validateRole } from '../auth/auth.middleware.js';
import * as TeacherController from './teacher.controller.js';

const router = Router();

router.get('/getAllTeacher', validateToken, TeacherController.getAllTecher);
router.post('/addTeacher', validateToken, validateRole(['admin']));
router.post('/updateTeacher', TeacherController.updateTeacher);

export default router;
