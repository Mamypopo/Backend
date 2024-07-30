import { main } from '../../database.js';

export default class AuthRepository {
  db = main;

  async getUserByEmail(email) {
    const sql = `SELECT
                 id,
                 email,
                 password,
                 firstName,
                 lastName,
                 role,
                 studentId,
                 faculty,
                 branch,
                 phone,
                 lineId,
                 profileImg,
                 facebookName
                 FROM vUser
                 WHERE email = ?`;

    const [[user]] = await this.db.query(sql, email);

    if (user) {
      return user;
    }

    return undefined;
  }

  async getUserById(id) {
    const sql = `SELECT
                 id,
                 email,
                 password,
                 firstName,
                 lastName,
                 role,
                 studentId,
                 faculty,
                 branch,
                 phone,
                 lineId,
                 profileImg,
                 facebookName
                 FROM vUser
                 WHERE id = ?`;

    const [[user]] = await this.db.query(sql, id);

    if (user) {
      return user;
    }

    return undefined;
  }
}
