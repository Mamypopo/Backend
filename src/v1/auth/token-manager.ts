import jwt from 'jsonwebtoken';
import config from '../../app.config';

export default class TokenManager {
  private secretKey = config.app.authenKey as jwt.Secret;

  generateToken(data: string | object | Buffer): string {
    return jwt.sign(data, this.secretKey, {
      expiresIn: '3h',
    });
  }

  validateToken(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, this.secretKey);
  }
}
