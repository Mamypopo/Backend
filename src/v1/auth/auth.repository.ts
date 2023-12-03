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
                 firstName,
                 lastName,
                 role,
                 faculty,
                 branch,
                 phone,
                 lineId,
                 profileImg,
                 facebookName
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
                 password,
                 firstName,
                 lastName,
                 role,
                 faculty,
                 branch,
                 phone,
                 lineId,
                 profileImg,
                 facebookName
                 FROM vUser
                 WHERE id = ?`;

    const [[user]] = await this.db.query<RowDataPacket[]>(sql, id);

    if (user) {
      return user as UserBase;
    }

    return undefined;
  }
}
