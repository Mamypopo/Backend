import { Request, Response, NextFunction } from 'express';
import InvalidPasswordError from './error/invalid-password.error';
import InvalidEmailError from './error/invalid-email.error';
import InvalidIdError from './error/invalid-id.error';
import AuthService from './auth.service';
import DuplicateUserError from '../common/error/duplicate-user.error';

export default class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as { email?: string, password?: string };

    try {
      const {
        user,
        token,
      } = await this.authService.authenticateByEmailAndPassword(email ?? '', password ?? '');
      res.status(200).send({
        message: 'success',
        result: {
          user,
          token,
        },
        cause: '-',
      });
    } catch (error: unknown) {
      if (error instanceof InvalidPasswordError || error instanceof InvalidEmailError) {
        res.status(401).send({
          message: 'unauthorized',
          cause: 'invalid email or password',
        });
        return;
      }

      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.authService.getUserProfile(req.user!.id ?? 0);

      res.status(200).send({
        message: 'success',
        result: {
          user,
        },
        cause: '-',
      });
    } catch (error: unknown) {
      if (error instanceof InvalidIdError) {
        res.status(401).send({
          message: 'unauthorized',
          cause: 'invalid id',
        });
        return;
      }
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.files) {
        const file = req.files as { [fieldname: string]: Express.Multer.File[] };
        const { user, token } = await this.authService.createUser(req.body, file['picture'][0]);
        res.status(200).send({
          status: 'success',
          result: {
            user, token,
          },
          message: '-',
          cause: '-',
        });
      }
    } catch (error: unknown) {
      if (error instanceof DuplicateUserError) {
        res.status(400).send({
          message: 'cannot register',
          cause: 'duplicate username',
        });
        return;
      }
      next(error);
    }
  }
}
