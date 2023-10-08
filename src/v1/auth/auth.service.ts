import bcrypt from 'bcrypt';
import TokenManager from './token-manager';
import AuthRepository from './auth.repository';
import UserModel from '../common/user/user.base';
import InvalidIdError from './error/invalid-id.error';
import InvalidPasswordError from './error/invalid-password.error';
import InvalidEmailError from './error/invalid-email.error';

type UserWithoutPassword = Omit<UserModel, 'password'>;

export default class AuthService {
  protected authRepo = new AuthRepository();

  private tokenManager = new TokenManager();

  public async authenticateByEmailAndPassword(email: string, password: string) {
    const user = await this.authRepo.getUserByEmail(email);

    if (user && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const userWithoutPass: UserWithoutPassword = { ...user };

        const token = this.tokenManager.generateToken(userWithoutPass);

        return {
          user: userWithoutPass,
          token,
        };
      }

      throw new InvalidPasswordError();
    }

    throw new InvalidEmailError();
  }

  public async getUserProfile(userId: number): Promise<UserModel> {
    const user = await this.authRepo.getUserById(userId);

    if (user) {
      return user;
    }

    throw new InvalidIdError();
  }
}
