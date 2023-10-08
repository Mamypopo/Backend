import express, { Request, Response } from 'express';
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

    this.app.use(upload.array('picture'));
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  private setupGlobalErrorHandler() {
    this.app.use((error: Error, req: Request, res: Response) => {
      console.error('UNKNOWN ERROR', error);
      res.status(500).send({
        message: 'internal error',
        result: null,
        cause: 'unknown',
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
