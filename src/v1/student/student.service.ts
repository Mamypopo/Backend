import { FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';
import { main as db } from '../../database';
import User, { NewUser } from '../common/user/user.base';
import DuplicateUserError from '../common/error/duplicate-user.error';
import FileManager from '../common/file-manager';

export default class StudentService {
  fileManager = new FileManager();

  public async getUserByEmail(email: string): Promise<User | undefined> {
    const sql = `SELECT
                 id,
                 email,
                 password,
                 first_name as firstName,
                 last_name as lastName,
                 faculty,
                 branch,
                 phone,
                 line_id as lineId,
                 facebook_name as facebookName
                 FROM vuser
                 WHERE email = ?`;

    const [[teacher]] = await db.query<RowDataPacket[]>(sql, email);

    return teacher as User;
  }

  public async getUserById(id: number): Promise<User | undefined> {
    const sql = `SELECT
                 id,
                 email,
                 password,
                 first_name as firstName,
                 last_name as lastName,
                 faculty,
                 branch,
                 phone,
                 line_id as lineId,
                 facebook_name as facebookName
                 FROM vuser
                 WHERE id = ?`;

    const [[teacher]] = await db.query<RowDataPacket[]>(sql, id);

    return teacher as User;
  }

  public async createStudent(student: NewUser, file: Express.Multer.File) {
    let connection = null;
    try {
      const userSql = 'INSERT INTO users SET email = ?, password = ?, first_name = ?, last_name = ?, role = ?';
      const teacherSql = 'INSERT INTO students SET user_id = ?, student_id = ?, faculty = ?, branch = ?, line_id = ?, facebook_name = ?, phone = ?';

      connection = await db.getConnection();

      await connection.beginTransaction();

      const [{ insertId }] = await connection.query(userSql, [
        student.email,
        student.password,
        student.firstName,
        student.lastName,
        student.role,
      ]) as [ResultSetHeader, FieldPacket[]];

      await connection.query(teacherSql, [
        insertId,
        student.studentId,
        student.faculty,
        student.branch,
        student.lineId,
        student.facebookName,
        student.phone,
      ]);

      const fileName = `/student/${insertId}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`;

      await this.fileManager.writeFile(fileName, file);

      await connection.query('UPDATE users SET profile_img = ? WHERE id = ?', [
        fileName,
        insertId,
      ]);

      await connection.commit();
      connection.release();
      return insertId;
    } catch (error) {
      if (connection) {
        const dbError = error as { code: string };
        await connection.rollback();
        connection.release();
        if (dbError.code === 'ER_DUP_ENTRY') {
          throw new DuplicateUserError();
        }
      }
      throw error;
    }
  }

  public async updateFileName(studentId: number | string, fileName: string) {
    const sql = 'UPDATE users SET profile_img = ? WHERE id = ?';

    await db.query(sql, [
      fileName,
      studentId,
    ]);
  }

  public async updateStudent(student: User, file?: Express.Multer.File) {
    const userSql = `UPDATE users SET
                     first_name = ?,
                     last_name = ?
                     WHERE id = ?`;
    const studentSql = `UPDATE students SET
                        student_id = ?,
                        faculty = ?,
                        branch = ?,
                        line_id = ?,
                        facebook_name = ?,
                        phone = ?
                        WHERE user_id = ?`;

    // upload file
    // update table users
    // update table students

    if (file) {
      const fileName = `/student/${student.id}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`;

      await this.fileManager.writeFile(fileName, file);
    }

    // const encryptPassword = await bcrypt.hash(student.password!, 10);

    await db.query(userSql, [
      student.firstName,
      student.lastName,
      student.id,
    ]);

    await db.query(studentSql, [
      student.studentId,
      student.faculty,
      student.branch,
      student.lineId,
      student.facebookName,
      student.phone,
      student.id,
    ]);
  }
}
