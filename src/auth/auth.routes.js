import { Router } from 'express';
import { login, getProfile } from './auth.controller.js';
import validateToken from './auth.middleware.js';

const router = Router();

router.get('/profile', validateToken, getProfile);

router.post('/login', login);



export default router;
