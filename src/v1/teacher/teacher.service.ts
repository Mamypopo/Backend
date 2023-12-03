/* eslint-disable no-await-in-loop */
import { FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import fs from 'fs/promises';
import { main as db } from '../../database';
import User, { NewUser } from '../common/user/user.base';
import FileManager from '../common/file-manager';

export default class TeacherService {
  private fileManager = new FileManager();

  public async getAllTeacher() {
    const sql = `SELECT
                 id,
                 email,
                 password,
                 firstName,
                 lastName,
                 faculty,
                 branch,
                 phone,
                 lineId,
                 facebookName,
                 profileImg
                 FROM vuser
                 WHERE role = 'teacher'`;

    const [result] = await db.query<RowDataPacket[]>(sql);

    const users = result as User[];

    const mapUser: User[] = [];

    for (let index = 0; index < result.length; index += 1) {
      const user = users[index];
      user.profileImg = user.profileImg ? (await fs.readFile(`./upload${user.profileImg}`)).toString('base64') : '';
      mapUser.push({ ...user });
    }

    return mapUser;
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

  public async createTeacher(teacher: NewUser, file: Express.Multer.File) {
    let connection = null;
    try {
      const userSql = 'INSERT INTO users SET email = ?, password = ?, first_name = ?, last_name = ?, role = ?';
      const teacherSql = 'INSERT INTO teachers SET user_id = ?, faculty = ?, branch = ?, line_id = ?, facebook_name = ?, phone = ?';

      connection = await db.getConnection();

      await connection.beginTransaction();

      const [{ insertId }] = await connection.query(userSql, [
        teacher.email,
        teacher.password,
        teacher.firstName,
        teacher.lastName,
        teacher.role,
      ]) as [ResultSetHeader, FieldPacket[]];

      await connection.query(teacherSql, [
        insertId,
        teacher.faculty,
        teacher.branch,
        teacher.lineId,
        teacher.facebookName,
        teacher.phone,
      ]);

      const fileName = `/teacher/${insertId}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`;

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
        await connection.rollback();
        connection.release();
      }
      throw error;
    }
  }
}
