import { RowDataPacket } from 'mysql2';
import { main as db } from '../../database';
import { TeacherModel } from './teacher.model';

export default class TeacherRepository {
  public async getUserByEmail(email: string): Promise<TeacherModel | undefined> {
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
                 FROM admins
                 WHERE email = ?`;

    const [[admin]] = await db.query<RowDataPacket[]>(sql, email);

    return admin as TeacherModel;
  }

  public async getUserById(id: number): Promise<TeacherModel | undefined> {
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
                 FROM admins
                 WHERE id = ?`;

    const [[admin]] = await db.query<RowDataPacket[]>(sql, id);

    return admin as TeacherModel;
  }
}
