import { Router } from 'express';
import { insertuser, getuser, updateuser, deleteuser} from './user.controller.js';

const router = Router();

router.get('/getuser', getuser);

router.post('/insertuser',insertuser);

router.post('/updateuser',updateuser);

router.post('/deleteuser',deleteuser);

export default router;
