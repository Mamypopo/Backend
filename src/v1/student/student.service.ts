import { FieldPacket, ResultSetHeader, RowDataPacket } from 'mysql2';
import { main as db } from '../../database';
import User, { NewUser } from '../common/user/user.base';

export default class StudentService {
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

  public async createStudent(student: NewUser) {
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
