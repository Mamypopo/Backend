import { Router } from 'express';
import * as InformationController from './information.controller.js';

const router = Router();

router.get('/getAllInformation', InformationController.getAllInformation);
router.post('/addInformation', InformationController.addInformation);
router.post('/updateInformation');

export default router;
