import TokenExpiredError from './error/token-expired.error.js';
import TokenManager from './token-manager.js';

const validateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).send({
        message: 'unauthorized',
        cause: 'missing auth header',
      });
      return;
    }

    const [schema, token] = authHeader.split(' ');

    if (!schema) {
      res.status(401).send({
        message: 'unauthorized',
        cause: 'invalid token schema',
      });
      return;
    }

    if (!token) {
      res.status(401).send({
        message: 'unauthorized',
        cause: 'missing token',
      });
      return;
    }

    const decodedToken = new TokenManager().validateToken(token);

    if (!decodedToken) {
      res.status(401).send({
        message: 'unauthorized',
        cause: 'invalid token',
      });
      return;
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(401).send({
        message: 'unauthorized',
        cause: 'token expired',
      });
      return;
    }

    next(error);
  }
};

export default validateToken;

export const validateRole = (roles) => {
  const handler = (req, res, next) => {
    const { role } = req.user;
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
