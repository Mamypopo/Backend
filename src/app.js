import express from 'express';
import cors from 'cors';
import multer from 'multer';
import config from './app.config.js';
import V1Router from './v1/index.routes.js';
import generatePDF from './v1/activity/activity-pdf.js';

class Main {
  app = express();

  constructor() {
    this.setupMiddleware();
    this.setupMulter();
    this.setupRoute();
    this.setupGlobalErrorHandler();
  }

  setupMulter() {
    const upload = multer({
      storage: multer.memoryStorage(),
    });

    this.app.use(upload.fields([
      {
        name: 'picture',
        maxCount: 1,
      },
      {
        name: 'pictures',
      },
    ]));
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  setupGlobalErrorHandler() {
    this.app.use((error, req, res, next) => {
      console.error('unknown error: ', error);
      res.status(500).send({
        message: 'internal error',
        cause: config.app.env !== 'production' ? error.message : 'unknown',
      });
    });
  }

  setupRoute() {
    this.app.use('/api/v1', V1Router);
  }

  run() {
    this.app.listen(config.app.port, () => {
      console.info(`[Jit asa web service] run on ${config.app.env} env and using port ${config.app.port}`);
    });
  }
}

new Main().run();

generatePDF([{
  activityName: 'ทำความสะอาดลานวัด',
  location: 'วัดนาวง',
  date: '2023-01-01',
  time: '13:00',
  hourGain: 2,
  updateStatusBy: 'อาจารย์ ทดสอบ ทดสอบ',
}]);
