import jwt from 'jsonwebtoken';
import config from '../config.js';

export default (req, res, next) => {
  try {
    const authorization = req.headers?.authorization;

    if (!authorization) {
      res.status(401).send({
        status: 'error',
        message: 'authorization header not found',
      });
      return;
    }

    const [schema, token] = authorization.split(' ');

    if (schema !== 'Bearer') {
      res.status(401).send({
        status: 'error',
        message: 'invalid token format',
      });
      return;
    }

    if (token === '') {
      res.status(401).send({
        status: 'error',
        message: 'token not found',
      });
      return;
    }

    const user = jwt.verify(token, config.app.jwtKey);

    res.locals.user = user;
    next();
  } catch (error) {
    if (error.message === 'token expired') {
      res.status(401).send({
        status: 'error',
        message: 'session หมดอายุ',
        cause: 'token expired',
      });
      return;
    }
    res.status(500).send({
      status: 'error',
      message: 'เกิดข้อผิดพลาด',
      cause: 'unknown',
    });
  }
};
