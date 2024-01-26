import { Router } from 'express';
import * as StudentController from './student.controller.js';
import validateToken, { validateRole } from '../auth/auth.middleware.js';

const router = Router();

router.get('/getAllStudent', validateToken, validateRole(['admin']), StudentController.getAllStudent);
router.post('/updateStudent', validateToken, StudentController.updateStudent);
router.post('/deleteStudent', validateToken, validateRole(['admin', 'teacher']), StudentController.deleteStudent);

export default router;
