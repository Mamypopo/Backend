import { Router } from 'express';
import * as NewController from './new.controller.js';
import validateToken, { validateRole } from '../auth/auth.middleware.js';

const router = Router();

router.get('/getAllNew', NewController.getAllNewHandler);
router.post('/addNew', validateToken, validateRole(['admin', 'teacher']), NewController.addNewHandler);
router.post('/updateNew', validateToken, validateRole(['admin', 'teacher']), NewController.updateNewHandler);
router.post('/deleteNew', validateToken, validateRole(['admin', 'teacher']), NewController.deleteNewHanlder);

export default router;
