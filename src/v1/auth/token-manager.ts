import jwt from 'jsonwebtoken';
import config from '../../app.config';
import TokenExpiredError from './error/token-expired.error';

export default class TokenManager {
  private secretKey = config.app.authenKey as jwt.Secret;

  generateToken(data: string | object | Buffer): string {
    return jwt.sign(data, this.secretKey, {
      expiresIn: '3h',
    });
  }

  validateToken(token: string): string | jwt.JwtPayload {
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
