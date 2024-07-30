import jwt from 'jsonwebtoken';
import config from '../../app.config.js';
import TokenExpiredError from './error/token-expired.error.js';

export default class TokenManager {
  secretKey = config.app.authenKey;

  generateToken(data) {
    return jwt.sign(data, this.secretKey, {
      expiresIn: '10h',
    });
  }

  validateToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredError();
      }
      throw error;
    }
  }
}
