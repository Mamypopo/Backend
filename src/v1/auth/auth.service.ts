import bcrypt from 'bcrypt';
import TokenManager from './token-manager';
import AuthRepository from './auth.repository';
import UserModel from '../common/user/user.base';
import InvalidIdError from './error/invalid-id.error';
import InvalidPasswordError from './error/invalid-password.error';
import InvalidEmailError from './error/invalid-email.error';
import StudentService from '../student/student.service';
import TeacherService from '../teacher/teacher.service';
import FileManager from '../common/file-manager';

type UserWithoutPassword = Omit<UserModel, 'password'>;

export default class AuthService {
  protected authRepo = new AuthRepository();

  private tokenManager = new TokenManager();

  private fileManager = new FileManager();

  public async authenticateByEmailAndPassword(email: string, password: string) {
    const user = await this.authRepo.getUserByEmail(email);

    if (user?.password) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const userWithoutPass: UserWithoutPassword = { ...user };

        const token = this.tokenManager.generateToken(userWithoutPass);

        userWithoutPass.profileImg = await this.fileManager.getFileBase64(
          userWithoutPass.profileImg!,
        );

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
      user.profileImg = await this.fileManager.getFileBase64(
        user.profileImg!,
      );
      return user;
    }

    throw new InvalidIdError();
  }

  public async createUser(user: UserModel, file: Express.Multer.File) {
    const encryptPass = await bcrypt.hash(user.password!, 10);
    let userId = 0;
    const newUser = { ...user };
    newUser.password = encryptPass;
    if (user.role === 'student') {
      userId = await new StudentService().createStudent(newUser, file);
    } else if (user.role === 'teacher') {
      userId = await new TeacherService().createTeacher(newUser, file);
    }

    const userWithoutPass: UserWithoutPassword = { ...user };
    userWithoutPass.id = userId;

    const token = this.tokenManager.generateToken(userWithoutPass);

    return {
      user: userWithoutPass,
      token,
    };
  }
}
