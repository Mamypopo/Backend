import { RowDataPacket } from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';
import { main } from '../../database';
import UserBase from '../common/user/user.base';

export default class AuthRepository {
  private db = main;

  async getUserByEmail(email: string): Promise<UserBase | undefined> {
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
                 picture,
                 facebook_name as facebookName
                 FROM vUser
                 WHERE email = ?`;

    const [[user]] = await this.db.query<RowDataPacket[]>(sql, email);

    if (user) {
      return user as UserBase;
    }

    return undefined;
  }

  async getUserById(id: number): Promise<UserBase | undefined> {
    const sql = `SELECT
                 id,
                 email,
                 first_name as firstName,
                 last_name as lastName,
                 faculty,
                 branch,
                 phone,
                 line_id as lineId,
                 picture,
                 facebook_name as facebookName
                 FROM students
                 WHERE id = ?`;

    const [[user]] = await this.db.query<RowDataPacket[]>(sql, id);

    if (user) {
      return user as UserBase;
    }

    return undefined;
  }
}
