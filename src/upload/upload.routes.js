import { Router } from 'express';
import multer from 'multer';
import { uploadFiles } from './upload.controller.js';

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post('/uploadFiles', upload.single('file'), uploadFiles);

export default router;
