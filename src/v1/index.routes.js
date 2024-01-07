import { Router } from 'express';
import validateToken from './auth/auth.middleware.js';
import authRouter from './auth/auth.routes.js';
import newRouter from './new/new.routes.js';
import studentRouter from './student/student.routes.js';
import teacherRouter from './teacher/teacher.routes.js';
import activityRouter from './activity/activity.routes.js';

const router = Router();

router.use('/activities', activityRouter);
router.use('/teachers', teacherRouter);
router.use('/students', validateToken, studentRouter);
router.use('/news', newRouter);
router.use('/auth', authRouter);

export default router;
