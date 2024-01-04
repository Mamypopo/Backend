import { Router } from 'express';
import validateToken from './auth/auth.middleware.js';
import authRouter from './auth/auth.routes.js';
import informationRouter from './new/new.routes.js';
import studentRouter from './student/student.routes.js';
import teacherRouter from './teacher/teacher.routes.js';

const router = Router();

router.use('/teachers', teacherRouter);
router.use('/students', validateToken, studentRouter);
router.use('/news', informationRouter);
router.use('/auth', authRouter);

export default router;
