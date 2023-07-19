import { Router } from 'express';
import authRouter from './auth/auth.routes.js';
import userRouter from './user/user.routes.js';
import uploadRouter from './upload/upload.routes.js';

const router = Router();

router.use('/auth', authRouter);

router.use('/user', userRouter);

router.use('/upload', uploadRouter);

export default router;
