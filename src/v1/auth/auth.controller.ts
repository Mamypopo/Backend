import { Request, Response, NextFunction } from 'express';
import InvalidPasswordError from './error/invalid-password.error';
import InvalidEmailError from './error/invalid-email.error';
import InvalidIdError from './error/invalid-id.error';
import AuthService from './auth.service';

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
      if (error instanceof InvalidPasswordError) {
        res.status(401).send({
          message: 'unauthorized',
          result: null,
          cause: 'invalid password',
        });
        return;
      }

      if (error instanceof InvalidEmailError) {
        res.status(401).send({
          message: 'unauthorized',
          result: null,
          cause: 'invalid email',
        });
        return;
      }

      if (error instanceof InvalidIdError) {
        res.status(401).send({
          message: 'unauthorized',
          result: null,
          cause: 'invalid id',
        });
        return;
      }

      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await this.authService.getUserProfile(req.user!.id ?? 0);

      res.status(200).send({
        message: 'success',
        result: {
          student,
        },
        cause: '-',
      });
    } catch (error: unknown) {
      if (error instanceof InvalidIdError) {
        res.status(401).send({
          message: 'unauthorized',
          result: null,
          cause: 'invalid id',
        });
        return;
      }
      next(error);
    }
  }
}
