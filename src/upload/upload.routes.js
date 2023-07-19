import { Router } from 'express';
import { uploadFiles } from './upload.controller.js';

const router = Router();

router.post('/uploadFiles',uploadFiles );




export default router;
