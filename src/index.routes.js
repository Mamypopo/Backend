import { Router } from 'express';
import authRouter from './auth/auth.routes.js';
import userRouter from './user/user.routes.js';

const router = Router();

router.use('/auth', authRouter);

router.use('/user',userRouter);

export default router;
