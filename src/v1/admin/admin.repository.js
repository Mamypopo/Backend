// import { RowDataPacket } from 'mysql2';
// import UserRepository from '../common/user/user.repository';
// import { AdminModel } from './admin.model';

// export default class AdminRepository extends UserRepository<AdminModel> {
//   public async getUserByEmail(email: string): Promise<AdminModel | undefined> {
//     const sql = `SELECT
//                  id,
//                  first_name,
//                  last_name,
//                  email,
//                  password,
//                  phone
//                  FROM admins
//                  WHERE email = ?`;

//     const [[admin]] = await this.db.query<RowDataPacket[]>(sql, email);

//     return admin as AdminModel;
//   }

//   public async getUserById(id: number): Promise<AdminModel | undefined> {
//     const sql = `SELECT
//                  id,
//                  first_name,
//                  last_name,
//                  email,
//                  password,
//                  phone
//                  FROM admins
//                  WHERE id = ?`;

//     const [[admin]] = await this.db.query<RowDataPacket[]>(sql, id);

//     return admin as AdminModel;
//   }
// }
