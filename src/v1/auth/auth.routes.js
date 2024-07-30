import { Router } from 'express';
import * as AuthController from './auth.controller.js';
import validateToken from './auth.middleware.js';

const router = Router();

router.get('/profile', validateToken, AuthController.getProfile);
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;
