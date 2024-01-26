import { Router } from 'express';
import validateToken, { validateRole } from '../auth/auth.middleware.js';
import * as TeacherController from './teacher.controller.js';

const router = Router();

router.get('/getAllTeacher', validateToken, validateRole(['admin']), TeacherController.getAllTecher);
router.post('/updateTeacher', validateToken, validateRole(['admin', 'teacher']), TeacherController.updateTeacher);
router.post('/deleteTeacher', validateToken, validateRole(['admin', 'teacher']), TeacherController.deleteTeacher);

export default router;
