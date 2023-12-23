import { Router } from 'express';
import validateToken from './auth/auth.middleware.js';
import authRouter from './auth/auth.routes.js';
import informationRouter from './information/information.routes.js';
import studentRouter from './student/student.routes.js';
import teacherRouter from './teacher/teacher.routes.js';

const router = Router();

router.use('/teachers', teacherRouter);
router.use('/students', validateToken, studentRouter);
router.use('/informations', validateToken, informationRouter);
router.use('/auth', authRouter);

export default router;
