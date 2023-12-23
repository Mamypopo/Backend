import { Router } from 'express';
import * as StudentController from './student.controller.js';

const router = Router();

router.post('/updateStudent', StudentController.updateStudent);

export default router;
