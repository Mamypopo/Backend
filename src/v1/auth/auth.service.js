import bcrypt from 'bcrypt';
import TokenManager from './token-manager.js';
import AuthRepository from './auth.repository.js';
import InvalidIdError from './error/invalid-id.error.js';
import InvalidPasswordError from './error/invalid-password.error.js';
import InvalidEmailError from './error/invalid-email.error.js';
import StudentService from '../student/student.service.js';
import TeacherService from '../teacher/teacher.service.js';
import FileManager from '../common/file-manager.js';

export default class AuthService {
  authRepo = new AuthRepository();

  tokenManager = new TokenManager();

  fileManager = new FileManager();

  async authenticateByEmailAndPassword(email, password) {
    const user = await this.authRepo.getUserByEmail(email);

    if (user?.password) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const userWithoutPass = { ...user };

        const token = this.tokenManager.generateToken(userWithoutPass);

        userWithoutPass.profileImg = await this.fileManager.getFileBase64(
          userWithoutPass.profileImg,
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

  async getUserProfile(userId) {
    const user = await this.authRepo.getUserById(userId);

    if (user) {
      user.profileImg = await this.fileManager.getFileBase64(
        user.profileImg,
      );
      return user;
    }

    throw new InvalidIdError();
  }

  async createUser(user, file) {
    const encryptPass = await bcrypt.hash(user.password, 10);
    let userId = 0;
    const newUser = { ...user };
    newUser.password = encryptPass;
    if (user.role === 'student') {
      userId = await new StudentService().createStudent(newUser, file);
    } else if (user.role === 'teacher') {
      userId = await new TeacherService().createTeacher(newUser, file);
    }

    const userWithoutPass = { ...user };
    userWithoutPass.id = userId;

    const token = this.tokenManager.generateToken(userWithoutPass);

    return {
      user: userWithoutPass,
      token,
    };
  }
}
