import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import config from './app.config';
import V1Route from './v1/index.routes';

class Main {
  private app = express();

  constructor() {
    this.setupMiddleware();
    this.setupMulter();
    this.setupRoute();
    this.setupGlobalErrorHandler();
  }

  private setupMulter() {
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

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  private setupGlobalErrorHandler() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('unknown error: ', error);
      res.status(500).send({
        message: 'internal error',
        cause: config.app.env !== 'production' ? error.message : 'unknown',
      });
    });
  }

  private setupRoute() {
    this.app.use('/api/v1', new V1Route().getRouter());
  }

  public run() {
    this.app.listen(config.app.port, () => {
      console.info(`[Jit asa web service] run on ${config.app.env} env and using port ${config.app.port}`);
    });
  }
}

new Main().run();
