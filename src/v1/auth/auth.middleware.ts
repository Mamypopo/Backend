import { NextFunction, Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import TokenManager from './token-manager';
import UserBase from '../common/user/user.base';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenManager = new TokenManager();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).send({
        message: 'unauthorized',
        cause: 'missing token',
      });
      return;
    }

    const decodedToken = tokenManager.validateToken(token);

    if (!decodedToken) {
      res.status(401).send({
        message: 'unauthorized',
        cause: 'invalid token',
      });
      return;
    }

    req.user = decodedToken as UserBase;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).send({
        message: 'unauthorized',
        result: null,
        cause: 'token expired',
      });
      return;
    }

    next(error);
  }
};

export default validateToken;

export const validateRole = (roles: string[]) => {
  const handler = (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user!;
    if (roles.includes(role)) {
      next();
      return;
    }
    res.status(401).send({
      status: 'error',
      message: 'unauthorized',
      cause: 'invalid user role',
    });
  };
  return handler;
};
